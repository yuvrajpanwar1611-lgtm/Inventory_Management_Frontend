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
  useEffect(() => {
    if (!token) return;

    const payload = parseJwt(token);
    if (payload?.exp) {
      const expMs = payload.exp * 1000;
      if (Date.now() > expMs) {
        console.warn("Token expired — clearing locally.");
        localStorage.removeItem("token");
        setToken(null);
      }
    }
  }, [token]); // runs on token change to re-check expiry

  /* -----------------------------------------------------
      LOGIN — Save token + update React + redirect
  ------------------------------------------------------ */
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

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
      setToken(updated);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
