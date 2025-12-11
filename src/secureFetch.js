// src/secureFetch.js
import { AuthContext } from "./AuthContext";
import { useContext } from "react";

export default function secureFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = "Bearer " + token;

  return fetch(url, { ...options, headers }).then((res) => {
    if (res.status === 401) {
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return res;
  });
}
