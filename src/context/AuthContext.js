"use client";

import { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Login function
  const login = (userData) => {
    // Store user and token in localStorage to persist session
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);

    // Update the user state
    setUser(userData);

    // Set the auth token for all future API requests
    API.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
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
  const value = { user, login, logout, loading, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
