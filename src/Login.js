// import React, { useState } from "react";

// const Login = () => {
//   const [form, setForm] = useState({ username: "", password: "" });

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const body = new URLSearchParams();
//     body.append("username", form.username);
//     body.append("password", form.password);

//     const res = await fetch("https://inventory-management-ero4.onrender.com/token", {
//       method: "POST",
//       body,
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       return alert(data.detail || "Login failed");
//     }

//     localStorage.setItem("token", data.access_token);
//     window.location.href = "/";
//   };

//   return (
//     <div className="container mt-5" style={{ maxWidth: "450px" }}>
//       <div className="card shadow-sm p-4">
//         <h3 className="text-center mb-3">Login</h3>

//         <form onSubmit={handleLogin}>
//           <input className="form-control mb-3" placeholder="Username"
//             value={form.username}
//             onChange={(e) => setForm({ ...form, username: e.target.value })}
//             required
//           />

//           <input className="form-control mb-3" type="password" placeholder="Password"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//             required
//           />

//           <button className="btn btn-primary w-100">Login</button>
//         </form>

//         <div className="text-center mt-3">
//           <a href="/signup">Create new account</a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
// src/Login.js
import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { API_ENDPOINTS } from "./config";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    const body = new URLSearchParams();
    body.append("username", form.username);
    body.append("password", form.password);

    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.detail || "Login failed");
      }

      // Store token + redirect using AuthContext
      login(data.access_token);

    } catch (err) {
      console.error("Login error:", err);
      alert("Failed to login. Check network or server.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <div className="card shadow-sm p-4">
        <h3 className="text-center mb-3">Login</h3>

        <form onSubmit={handleLogin}>
          <input
            className="form-control mb-3"
            placeholder="Username"
            name="username"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            required
          />

          <input
            className="form-control mb-3"
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button className="btn btn-primary w-100">Login</button>
        </form>

        <div className="text-center mt-3">
          <a href="/signup">Create new account</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
