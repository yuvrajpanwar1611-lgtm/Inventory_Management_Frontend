// src/useSecureFetch.js
import { useCallback, useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useSecureFetch() {
  const { token, logout } = useContext(AuthContext);

  return useCallback(async (url, options = {}) => {
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
  }, [logout, token]);
}

// Support both default and named imports across the app
export default useSecureFetch;
