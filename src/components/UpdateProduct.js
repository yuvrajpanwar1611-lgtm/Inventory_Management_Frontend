// src/components/UpdateProduct.js
import React, { useContext, useEffect } from "react";
import { UpdateProductContext } from "../UpdateProductContext";
import useSecureFetch from "../useSecureFetch";
import { API_ENDPOINTS } from "../config";

const UpdateProduct = () => {
  const [info, setInfo] = useContext(UpdateProductContext);
  const secureFetch = useSecureFetch();

  /* ---------------------- REDIRECT IF NO PRODUCT ---------------------- */
  useEffect(() => {
    if (!info?.ProductId) {
      window.location.href = "/";
    }
  }, [info]);

  /* ---------------------- FORM FIELD CHANGE --------------------------- */
  const handleChange = (e) => {
    let value = e.target.value;

    // Safe conversion for number inputs
    if (e.target.type === "number") {
      value = value === "" ? "" : Number(value);
    }

    setInfo({ ...info, [e.target.name]: value });
  };

  /* ---------------------- SUBMIT UPDATE ---------------------- */
  const updateData = async (e) => {
    e.preventDefault();

    const quantity_in_stock = Number(info.QuantityInStock);
    const quantity_sold = Number(info.QuantitySold);
    const unit_price = Number(info.UnitPrice);
    const revenue = Number(info.Revenue);
    const profit_per_piece = Number(info.ProfitPerPiece);

    if (
      [quantity_in_stock, quantity_sold, unit_price, revenue, profit_per_piece].some(
        (n) => Number.isNaN(n)
      )
    ) {
      alert("All numeric fields must be valid numbers");
      return;
    }

    const payload = {
      name: info.ProductName,
      quantity_in_stock,
      quantity_sold,
      unit_price,
      revenue,
      profit_per_piece,
    };

    const res = await secureFetch(API_ENDPOINTS.PRODUCT_BY_ID(info.ProductId), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Product updated successfully!");
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.detail || "Update failed");
    }
  };

  /* ---------------------- PREVENT BLANK RENDER ---------------------- */
  if (!info?.ProductId) return null;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title mb-3">Update Product</h3>

          <form onSubmit={updateData}>
            {/* NAME */}
            <div className="mb-3">
              <label htmlFor="product-name">Product Name</label>
              <input
                id="product-name"
                className="form-control"
                name="ProductName"
                value={info.ProductName}
                onChange={handleChange}
                required
              />
            </div>

            {/* STOCK & SOLD */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="qty-stock">Quantity In Stock</label>
                <input
                  id="qty-stock"
                  type="number"
                  className="form-control"
                  name="QuantityInStock"
                  value={info.QuantityInStock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="qty-sold">Quantity Sold</label>
                <input
                  id="qty-sold"
                  type="number"
                  className="form-control"
                  name="QuantitySold"
                  value={info.QuantitySold}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* PRICE & REVENUE */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="unit-price">Unit Price</label>
                <input
                  id="unit-price"
                  type="number"
                  className="form-control"
                  name="UnitPrice"
                  value={info.UnitPrice}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="revenue">Revenue</label>
                <input
                  id="revenue"
                  type="number"
                  className="form-control"
                  name="Revenue"
                  value={info.Revenue}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* PROFIT */}
            <div className="mb-3">
              <label htmlFor="profit-piece">Profit Per Piece</label>
              <input
                id="profit-piece"
                type="number"
                className="form-control"
                name="ProfitPerPiece"
                value={info.ProfitPerPiece}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-success w-100">Update Product</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
