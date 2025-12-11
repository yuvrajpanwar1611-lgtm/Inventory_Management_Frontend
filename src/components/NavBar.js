// import React, { useContext, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { ProductContext } from "../ProductContext";

// const NavBar = () => {
//   const [products] = useContext(ProductContext);
//   const [user, setUser] = useState(null);

//   const fetchUser = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const res = await fetch("https://inventory-management-ero4.onrender.com/users/me", {
//         headers: {
//           Authorization: "Bearer " + token,
//         },
//       });

//       if (res.status === 401) {
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//         return;
//       }

//       const data = await res.json();
//       setUser(data);
//     } catch (err) {}
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
//       <div className="d-flex align-items-center gap-3">
//         <Link to="/" className="navbar-brand fw-bold">Home</Link>
//         <Link to="/addproduct" className="nav-link text-white">Add Product</Link>
//         <Link to="/purchase" className="nav-link text-white">Purchase Product</Link>
//         <Link to="/sell" className="nav-link text-white">Sell Product</Link>
//         <Link to="/suppliers" className="nav-link text-white">Suppliers</Link>
//         <Link to="/movement/1" className="nav-link text-white">Movement</Link>
//       </div>

//       <div className="ms-auto d-flex align-items-center gap-3 text-white">
//         <span>Products: {products.data.length}</span>
//         {user && <span>👤 {user.username}</span>}

//         <button
//           className="btn btn-light btn-sm"
//           onClick={() => {
//             localStorage.removeItem("token");
//             window.location.href = "/login";
//           }}
//         >
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;


import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "../ProductContext";
import { AuthContext } from "../AuthContext";   // ⬅️ NEW

const NavBar = () => {
  const [products] = useContext(ProductContext);
  const { logout, token } = useContext(AuthContext);   // ⬅️ NEW
  const [user, setUser] = useState(null);

  // ============================
  // FETCH LOGGED-IN USER DETAILS
  // ============================
  const fetchUser = async () => {
    if (!token) return; // ⬅️ USE CONTEXT TOKEN INSTEAD OF localStorage

    try {
      const res = await fetch(
        "https://inventory-management-ero4.onrender.com/users/me",
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      if (res.status === 401) {
        console.warn("Token expired or invalid → NOT auto-logging out");
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Failed to load user:", err);
    }
  };

  useEffect(() => {
    setTimeout(fetchUser, 200);
  }, [token]); // ⬅️ Fetch again when token changes (login/logout)

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      {/* LEFT SIDE NAV LINKS */}
      <div className="d-flex align-items-center gap-3">
        <Link to="/" className="navbar-brand fw-bold">Home</Link>
        <Link to="/addproduct" className="nav-link text-white">Add Product</Link>
        <Link to="/purchase" className="nav-link text-white">Purchase Product</Link>
        <Link to="/sell" className="nav-link text-white">Sell Product</Link>
        <Link to="/suppliers" className="nav-link text-white">Suppliers</Link>
        <Link to="/movement/1" className="nav-link text-white">Movement</Link>
      </div>

      {/* RIGHT SIDE USER + LOGOUT */}
      <div className="ms-auto d-flex align-items-center gap-4 text-white">
        <span>Products: {products?.data?.length || 0}</span>

        {user && (
          <span className="fw-bold">
            👤 {user.full_name?.trim() ? user.full_name : user.username}
          </span>
        )}

        <button
          className="btn btn-light btn-sm"
          onClick={logout}          // ⬅️ USE context logout()
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
