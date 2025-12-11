// src/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  // token = undefined → context has not loaded yet
  if (token === undefined) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  // No token → redirect
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated
  return children;
};

export default ProtectedRoute;


