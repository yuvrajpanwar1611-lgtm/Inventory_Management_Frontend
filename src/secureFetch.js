// src/useSecureFetch.js
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function SecureFetch() {
  const { token, logout } = useContext(AuthContext);

  return async (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization = "Bearer " + token;
    }

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      alert("Session expired. Please login again.");
      logout();
    }

    return res;
  };
}