"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import API from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const socket = useRef();

  //check for logged in user
  useEffect(() => {
    const loadUserFromLocalStorage = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      setLoading(false);
    };
    loadUserFromLocalStorage();
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
    // Store user and token in localStorage to persist session
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);

    // Update the user state
    setUser(userData);

    // Set the auth token for all future API requests
    API.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
    await fetchNotifications();
  };

  //logout function
  const logout = () => {
    // Clear from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Reset user state
    setUser(null);

    // Remove auth token from API headers
    delete API.defaults.headers.common["Authorization"];
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
