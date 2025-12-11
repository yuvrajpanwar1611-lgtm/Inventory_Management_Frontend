// src/secureFetch.js
export default async function secureFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = "Bearer " + token;

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    // token invalid/expired -> clear and redirect to login
    localStorage.removeItem("token");
    alert("Session expired. Please login again.");
    window.location.href = "/login";
  }

  return res;
}
