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
// src/components/NavBar.js
// src/components/NavBar.js
import React, { useContext, useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { ProductContext } from "../ProductContext";
import { AuthContext } from "../AuthContext";
import useSecureFetch from "../useSecureFetch";
import { API_ENDPOINTS } from "../config";

const NavBar = () => {
  const [products] = useContext(ProductContext);
  const { token, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const secureFetch = useSecureFetch();

  const decodeTokenName = (t) => {
    try {
      const payload = JSON.parse(atob(t.split(".")[1]));
      const candidate =
        payload.full_name ||
        payload.name ||
        payload.username ||
        payload.email ||
        payload.sub ||
        null;

      // Avoid showing numeric-only subject IDs as "names"
      if (candidate && typeof candidate === "string" && !/^\d+$/.test(candidate)) {
        return candidate;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Nav structure defined once for easy edits and mapping
  const links = useMemo(
    () => [
      { to: "/", label: "Home", end: true },
      { to: "/addproduct", label: "Add Product" },
      { to: "/purchase", label: "Purchase" },
      { to: "/sell", label: "Sell" },
      { to: "/suppliers", label: "Suppliers" },
      { to: "/movement", label: "Movement" },
    ],
    []
  );

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

      const fetchUser = async () => {
        let cancelled = false;
        try {
          const res = await secureFetch(API_ENDPOINTS.USER_ME);

        if (!res.ok) {
          console.warn("Failed to fetch user:", res.status);
          // Fallback to token decode when API fails
          const fallbackName = decodeTokenName(token);
          if (!cancelled) setUser(fallbackName ? { username: fallbackName } : null);
          return;
        }

        const data = await res.json().catch(() => null);
        // Handle different API shapes: {user}, {data}, or raw user object
        const normalizedUser = data?.user || data?.data || data;
        if (!cancelled) {
          if (normalizedUser) {
            setUser(normalizedUser);
          } else {
            const fallbackName = decodeTokenName(token);
            setUser(fallbackName ? { username: fallbackName } : null);
          }
        }
      } catch (err) {
        console.error("User fetch failed:", err);
        const fallbackName = decodeTokenName(token);
        if (!cancelled && fallbackName) {
          setUser({ username: fallbackName });
        }
      } finally {
        // noop
      }

      return () => {
        cancelled = true;
      };
    };

    fetchUser();
  }, [secureFetch, token]); // 🔥 Re-runs whenever token updates

  const productCount = products?.data?.length ?? 0;
  const displayName =
    user?.full_name ||
    user?.name ||
    user?.username ||
    user?.email ||
    (typeof user?.sub === "string" && !/^\d+$/.test(user.sub) ? user.sub : null);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3" role="navigation">
      <div className="container-fluid px-0">
        <NavLink to="/" end className="navbar-brand fw-bold">
          Inventory
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {links.map((link) => (
              <li key={link.to} className="nav-item">
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "fw-bold text-white" : "text-white-50"}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-3 text-white">
            <span className="small">Products: {productCount}</span>

            {displayName && (
              <span className="fw-bold small">
                👤 {displayName}
              </span>
            )}

            {token && (
              <button className="btn btn-light btn-sm" onClick={logout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
