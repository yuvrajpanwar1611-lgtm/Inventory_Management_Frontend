import React, { useContext, useEffect } from "react";
import { UpdateProductContext } from "../UpdateProductContext";
import secureFetch from "../secureFetch";

const UpdateProduct = () => {
  const [info, setInfo] = useContext(UpdateProductContext);

  // Redirect if loaded without selected product
  useEffect(() => {
    if (!info?.ProductId) {
      window.location.href = "/";
    }
  }, [info]);

  const handleChange = (e) => {
    let value = e.target.value;

    // Convert number fields safely
    if (e.target.type === "number") {
      value = value === "" ? "" : Number(value);
    }

    setInfo({ ...info, [e.target.name]: value });
  };

  const updateData = async (e) => {
    e.preventDefault();

    const payload = {
      name: info.ProductName,
      quantity_in_stock: Number(info.QuantityInStock),
      quantity_sold: Number(info.QuantitySold),
      unit_price: Number(info.UnitPrice),
      revenue: Number(info.Revenue),
      profit_per_piece: Number(info.ProfitPerPiece),
    };
    
    const secureFetch = useSecureFetch();
    const res = await secureFetch(
      `https://inventory-management-ero4.onrender.com/product/${info.ProductId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      alert("Product updated successfully!");
    } else {
      const err = await res.json();
      alert(err.detail || "Update failed");
    }
  };

  // Prevent UI render if info not ready
  if (!info?.ProductId) return null;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title mb-3">Update Product</h3>

          <form onSubmit={updateData}>
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
