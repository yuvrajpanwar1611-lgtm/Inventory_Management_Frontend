// src/components/ProductsTable.js
import React, { useEffect, useContext, useState } from "react";
import { ProductContext } from "../ProductContext";
import { UpdateProductContext } from "../UpdateProductContext";
import ProductRow from "./ProductRow";
import SupplierModal from "./SupplierModal";
import { useNavigate } from "react-router-dom";

const ProductsTable = () => {
  const [products, setProducts] = useContext(ProductContext);
  const [updateProductInfo, setUpdateProductInfo] = useContext(UpdateProductContext);

  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [supplierLoading, setSupplierLoading] = useState(false);
  const [supplierData, setSupplierData] = useState(null);

  const navigate = useNavigate();

  // ---------------- SECURE FETCH ----------------
  const secureFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };

    if (token) headers.Authorization = "Bearer " + token;

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return res;
  };

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProducts = async () => {
    const res = await secureFetch("https://inventory-management-ero4.onrender.com/product");
    const data = await res.json();

    // API returns { status, data } so update correctly
    setProducts({ data: data.data || [] });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ---------------- EDIT HANDLER ----------------
  const handleEdit = (p) => {
    setUpdateProductInfo({
      ProductId: p.id,
      ProductName: p.name,
      QuantityInStock: p.quantity_in_stock,
      QuantitySold: p.quantity_sold,
      UnitPrice: p.unit_price,
      Revenue: p.revenue,
      ProfitPerPiece: p.profit_per_piece,
    });
    navigate("/updateproduct");
  };

  // ---------------- DELETE HANDLER ----------------
  const handleDelete = async (p) => {
    if (!window.confirm("Delete this product?")) return;

    const res = await secureFetch(
      `https://inventory-management-ero4.onrender.com/product/${p.id}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      setProducts(prev => ({
        data: prev.data.filter(x => x.id !== p.id)
      }));
      alert("Product deleted");
    }
  };

  // ---------------- VIEW SUPPLIER ----------------
  const handleViewSupplier = async (supplierId) => {
    if (!supplierId) {
      alert("No supplier linked to this product.");
      return;
    }

    setSupplierLoading(true);
    setSupplierModalOpen(true);

    try {
      const res = await secureFetch(
        `https://inventory-management-ero4.onrender.com/supplier/${supplierId}`
      );
      const json = await res.json();
      setSupplierData(json.data ?? null);
    } catch (err) {
      console.error(err);
      alert("Failed to load supplier details");
      setSupplierModalOpen(false);
    }

    setSupplierLoading(false);
  };

  // ---------------- CURRENCY FORMAT ----------------
  const formatCurrency = (value) =>
    "₹" + Number(value || 0).toLocaleString("en-IN");

  return (
    <div className="container mt-4">
      <h2 className="mb-3 fw-bold">Products</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center align-middle shadow">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Supplier</th> {/* NEW */}
              <th>In Stock</th>
              <th>Sold</th>
              <th>Unit Price</th>
              <th>Revenue</th>
              <th>Net Profit</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.data?.length > 0 ? (
              products.data.map((p) => (
                <ProductRow
                  key={p.id}
                  product={{
                    ...p,
                    supplier_name: p.supplied_by?.name || "—", // supplier prefetch fix
                  }}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewSupplier={handleViewSupplier}
                />
              ))
            ) : (
              <tr>
                <td colSpan="9" className="fw-bold py-3">
                  No Products Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* SUPPLIER MODAL */}
      <SupplierModal
        open={supplierModalOpen}
        loading={supplierLoading}
        supplier={supplierData}
        onClose={() => setSupplierModalOpen(false)}
      />
    </div>
  );
};

export default ProductsTable;
