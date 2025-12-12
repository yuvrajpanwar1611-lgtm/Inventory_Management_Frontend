// src/components/AddProducts.js
import React, { useState } from "react";
import { useSecureFetch } from "../useSecureFetch";
import { API_ENDPOINTS } from "../config";

const AddProducts = () => {
  const [info, setInfo] = useState({
    Supplier: "",
    ProductName: "",
    UnitPrice: "",
    ProfitPerPiece: "",
  });

  const secureFetch = useSecureFetch();

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const postData = async (e) => {
    e.preventDefault();

    const unitPrice = Number(info.UnitPrice);
    const profit = Number(info.ProfitPerPiece);

    if (Number.isNaN(unitPrice) || unitPrice < 0) {
      alert("Enter a valid Unit Price");
      return;
    }
    if (Number.isNaN(profit) || profit < 0) {
      alert("Enter a valid Profit Per Piece");
      return;
    }
    if (!info.Supplier.trim()) {
      alert("Supplier ID is required");
      return;
    }

    const payload = {
      name: info.ProductName,
      quantity_in_stock: 0,
      quantity_sold: 0,
      unit_price: unitPrice,
      revenue: 0,
      profit_per_piece: profit,
    };

    const res = await secureFetch(API_ENDPOINTS.ADD_PRODUCT(info.Supplier), {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error.detail || "Failed to add product");
      return;
    }

    alert("Product added successfully!");

    setInfo({
      Supplier: "",
      ProductName: "",
      UnitPrice: "",
      ProfitPerPiece: "",
    });
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title mb-3">Add Product</h3>

          <form onSubmit={postData}>
            {/* Supplier Field */}
            <div className="mb-3">
              <label className="form-label">Supplier ID</label>
              <input
                id="supplier"
                className="form-control"
                name="Supplier"
                value={info.Supplier}
                onChange={handleChange}
                required
              />
            </div>

            {/* Product Name */}
            <div className="mb-3">
              <label className="form-label">Product Name</label>
              <input
                id="product_name"
                className="form-control"
                name="ProductName"
                value={info.ProductName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Unit Price */}
            <div className="mb-3">
              <label className="form-label">Unit Price</label>
              <input
                id="unit_price"
                className="form-control"
                type="number"
                name="UnitPrice"
                value={info.UnitPrice}
                onChange={handleChange}
                required
              />
            </div>

            {/* Profit Per Piece */}
            <div className="mb-3">
              <label className="form-label">Profit Per Piece</label>
              <input
                id="profit"
                className="form-control"
                type="number"
                name="ProfitPerPiece"
                value={info.ProfitPerPiece}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-primary w-100">Add Product</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
