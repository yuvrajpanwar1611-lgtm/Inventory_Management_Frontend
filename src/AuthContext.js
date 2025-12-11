// src/AuthContext.js
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  });

  // Parses JWT expiry if needed (not required for current flow but handy)
  const parseJwt = (t) => {
    try {
      const payload = JSON.parse(atob(t.split(".")[1]));
      return payload;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    // optional: check expiry on mount and clear if expired
    if (token) {
      const payload = parseJwt(token);
      if (payload && payload.exp) {
        const expMs = payload.exp * 1000;
        if (Date.now() > expMs) {
          // token expired -> clear
          localStorage.removeItem("token");
          setToken(null);
        }
      }
    }
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    // small timeout ensures React updates consumers before navigation
    setTimeout(() => {
      window.location.href = "/";
    }, 50);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
