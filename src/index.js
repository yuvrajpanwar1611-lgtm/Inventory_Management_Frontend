import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const { token } = useContext(AuthContext);
const isLoggedIn = Boolean(token);
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
