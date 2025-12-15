
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import NavBar from "./components/NavBar";
import ProductsTable from "./components/ProductsTable";
import AddProducts from "./components/AddProducts";
import UpdateProduct from "./components/UpdateProduct";
import SupplierPage from "./components/SupplierPage";
import PurchaseProduct from "./components/PurchaseProduct";
import SellProduct from "./components/SellProduct";
import StockMovement from "./components/StockMovement";
import ChatBot from "./components/ChatBot";

import Login from "./Login";
import Signup from "./Signup";
import ProtectedRoute from "./ProtectedRoute";

import { AuthProvider, AuthContext } from "./AuthContext";
import { ProductProvider } from "./ProductContext";
import { SupplierContextProvider } from "./SupplierContext";
import { UpdateProductContextProvider } from "./UpdateProductContext";


// ====================== LAYOUT ========================= //

function Layout() {
  const location = useLocation();
  const auth = React.useContext(AuthContext);
  const token = auth?.token;

  // Hide Navbar & ChatBot ONLY on Login + Signup
  const hideUI = location.pathname === "/login" || location.pathname === "/signup";
  
  return (
    <>
      {/* Navbar visible when authenticated and not on login/signup */}
      {!hideUI && token && <NavBar />}

      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ---------- PROTECTED ROUTES ---------- */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ProductsTable />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addproduct"
          element={
            <ProtectedRoute>
              <AddProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/updateproduct"
          element={
            <ProtectedRoute>
              <UpdateProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchase"
          element={
            <ProtectedRoute>
              <PurchaseProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sell"
          element={
            <ProtectedRoute>
              <SellProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/suppliers"
          element={
            <ProtectedRoute>
              <SupplierPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/movement"
          element={
            <ProtectedRoute>
              <StockMovement />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* ChatBot only when logged in */}
      {!hideUI && token && <ChatBot />}
    </>
  );
}


// ====================== APP WRAPPER ========================= //

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <SupplierContextProvider>
          <UpdateProductContextProvider>
           <Router>
             <Layout />
           </Router>
          </UpdateProductContextProvider>
        </SupplierContextProvider>
      </ProductProvider>
    </AuthProvider>
      );
    }

export default App;


