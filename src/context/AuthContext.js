"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import API, { setAccessToken } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const socket = useRef();

  //check for logged in user
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      console.log("form fetch noti function", res);
      setNotifications(res.data);
    } catch (err) {
      console.error("Could not fetch notifications", err);
    }
  };

  //for socket.io connection
  useEffect(() => {
    //initialize socket connection
    socket.current = io("http://localhost:5000");

    socket.current.on("getNotification", (data) => {
      // Update the notifications state
      setNotifications((prev) => [data, ...prev]);
      fetchNotifications();
    });
    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    //add user to the socket server
    if (user) {
      socket.current.emit("addUser", user._id);
    }
  }, [user]);

  // Login function
  const login = async (userData) => {
    // The token is now inside userData.accessToken
    setAccessToken(userData.accessToken);

    // Don't store the token in the user object in localStorage
    const { accessToken, ...userToStore } = userData;
    localStorage.setItem("user", JSON.stringify(userToStore));
    setUser(userToStore);
  };

  //logout function
  const logout = async () => {
    try {
      await API.post("/auth/logout"); // Call the backend logout
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("user");
      setAccessToken(""); // Clear the token from our store
      setUser(null);
    }
  };
  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    socket,
    notifications,
    setNotifications,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
