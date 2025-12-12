// src/AuthContext.js
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token") || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  /* -----------------------------------------------------
      OPTIONAL — Decode JWT for expiry check
  ------------------------------------------------------ */
  const parseJwt = (t) => {
    try {
      return JSON.parse(atob(t.split(".")[1]));
    } catch {
      return null;
    }
  };

  /* -----------------------------------------------------
      CHECK TOKEN EXPIRY ONLY ON FIRST LOAD
      (NO auto logout loops — safe)
  ------------------------------------------------------ */
  // Re-check expiry whenever token changes
  useEffect(() => {
    if (!token) return;

    const payload = parseJwt(token);
    if (payload?.exp && Date.now() > payload.exp * 1000) {
      console.warn("Token expired — clearing locally.");
      localStorage.removeItem("token");
      setToken(null);
    }
  }, [token]);

  /* -----------------------------------------------------
      LOGIN — Save token + update React + redirect
  ------------------------------------------------------ */
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setLoading(false);

    setTimeout(() => {
      window.location.href = "/";
    }, 80);
  };

  /* -----------------------------------------------------
      LOGOUT — Clear token + redirect to login
  ------------------------------------------------------ */
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/login";
  };

  /* -----------------------------------------------------
      SYNC TOKEN ACROSS ALL TABS
  ------------------------------------------------------ */
  useEffect(() => {
    const onStorage = () => {
      const updated = localStorage.getItem("token");
      setToken(updated || null);
      setLoading(false);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
