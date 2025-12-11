import { AuthContext } from "./AuthContext";
import { useContext } from "react";

// Hook version so components always get the fresh token
export function useSecureFetch() {
  const { token, logout } = useContext(AuthContext);

  return async (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (token) headers.Authorization = "Bearer " + token;

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      alert("Session expired. Please login again.");
      logout();
    }

    return res;
  };
}
