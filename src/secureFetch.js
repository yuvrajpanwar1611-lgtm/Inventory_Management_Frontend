// src/useSecureFetch.js
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useSecureFetch() {
  const { token, logout } = useContext(AuthContext);

  return async (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization = "Bearer " + token;
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    // Handle token expiry safely
    if (res.status === 401) {
      console.warn("401 received → token likely expired or invalid.");

      //  Avoid double alerts or infinite reload loops
      if (token) {
        alert("Session expired. Please login again.");
        logout(); // AuthContext handles cleanup + redirect
      }
    }

    return res;
  };
}
