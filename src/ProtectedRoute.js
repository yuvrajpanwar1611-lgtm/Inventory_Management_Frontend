// src/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  // Still resolving token from storage
  if (loading) {
    return <div className="text-center mt-5">Checking session...</div>;
  }

  // No token → redirect
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated
  return children;
};

export default ProtectedRoute;


