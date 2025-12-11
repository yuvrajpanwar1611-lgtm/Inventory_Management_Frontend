// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   if (!token) return <Navigate to="/login" replace />;

//   return children;
// };

// export default ProtectedRoute;
// ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";  // ⬅️ NEW

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext); // ⬅️ USE CONTEXT TOKEN

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
