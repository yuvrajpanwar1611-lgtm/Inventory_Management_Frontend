import React, { useState, useEffect, useCallback } from "react";
import useSecureFetch from "../useSecureFetch"; // ✅ Correct import

const PurchaseProduct = () => {
  const secureFetch = useSecureFetch(); // ✅ Hook can ONLY be used here
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [form, setForm] = useState({
    productId: "",
    supplier_id: "",
    quantity: "",
    buy_price: "",
  });

  /* ---------------- LOAD PRODUCTS + SUPPLIERS ---------------- */
  const loadData = useCallback(async () => {
    const prodRes = await secureFetch(
      "https://inventory-management-ero4.onrender.com/product"
    );
    const prodJson = await prodRes.json();

    const supRes = await secureFetch(
      "https://inventory-management-ero4.onrender.com/supplier"
    );
    const supJson = await supRes.json();

    setProducts(prodJson.data || []);
    setSuppliers(supJson.data || []);
  }, [secureFetch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ---------------- SELECT PRODUCT ---------------- */
  const handleProductSelect = (e) => {
    const pid = Number(e.target.value);
    const product = products.find((p) => p.id === pid);

    setForm((prev) => ({
      ...prev,
      productId: pid,
      supplier_id: product?.supplied_by_id || "",
      buy_price: product?.unit_price || "",
    }));
  };

  /* ---------------- SUBMIT PURCHASE ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      supplier_id: Number(form.supplier_id),
      quantity: Number(form.quantity),
      buy_price: Number(form.buy_price),
    };

    const res = await secureFetch(
      `https://inventory-management-ero4.onrender.com/product/purchase/${form.productId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Purchase failed");
      return;
    }

    alert("Stock purchased successfully!");

    // Reset form
    setForm({ productId: "", supplier_id: "", quantity: "", buy_price: "" });
    loadData();
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">

          <h3 className="mb-3">Purchase Product</h3>

          <form onSubmit={handleSubmit}>

            {/* PRODUCT DROPDOWN */}
            <div className="mb-3">
              <label className="form-label">Select Product</label>
              <select
                className="form-control"
                value={form.productId}
                onChange={handleProductSelect}
                required
              >
                <option value="">-- Select Product --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SUPPLIER DROPDOWN */}
            <div className="mb-3">
              <label className="form-label">Select Supplier</label>
              <select
                className="form-control"
                value={form.supplier_id}
                onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
                required
              >
                <option value="">-- Select Supplier --</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.company})
                  </option>
                ))}
              </select>
            </div>

            {/* QUANTITY + PRICE */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Buy Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.buy_price}
                  onChange={(e) =>
                    setForm({ ...form, buy_price: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <button className="btn btn-primary w-100">Purchase</button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default PurchaseProduct;
