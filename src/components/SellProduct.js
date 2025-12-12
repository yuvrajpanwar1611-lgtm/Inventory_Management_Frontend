import React, { useState, useEffect, useCallback } from "react";
import { useSecureFetch } from "../useSecureFetch";
import { API_ENDPOINTS } from "../config";

const SellProduct = () => {
  const secureFetch = useSecureFetch(); // ✅ HOOK CALLED ONCE AT TOP

  const [products, setProducts] = useState([]);
  const [rows, setRows] = useState([
    { id: Date.now(), product_id: "", qty: 1, sell_price: "", name: "", max_stock: 0 }
  ]);

  const [customer, setCustomer] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
  });

  const [loading, setLoading] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState(null);

  /* ---------------------- LOAD PRODUCTS ---------------------- */
  const loadProducts = useCallback(async () => {
    const res = await secureFetch(API_ENDPOINTS.PRODUCTS);
    const data = await res.json();
    setProducts(data.data || []);
  }, [secureFetch]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  /* ---------------------- ROW OPERATIONS ---------------------- */
  const addRow = () => {
    setRows(prev => [
      ...prev,
      { id: Date.now(), product_id: "", qty: 1, sell_price: "", name: "", max_stock: 0 }
    ]);
  };

  const removeRow = (id) => {
    if (rows.length === 1) return;
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const onProductChange = (rowId, productId) => {
    const prod = products.find(p => p.id === Number(productId));

    setRows(prev =>
      prev.map(row =>
        row.id === rowId
          ? {
              ...row,
              product_id: productId,
              qty: 1,
              sell_price: prod ? Number(prod.unit_price) + Number(prod.profit_per_piece) : "",
              name: prod ? prod.name : "",
              max_stock: prod ? prod.quantity_in_stock : 0
            }
          : row
      )
    );
  };

  const onRowChange = (rowId, key, value) => {
    setRows(prev => prev.map(r => (r.id === rowId ? { ...r, [key]: value } : r)));
  };

  const lineTotal = (r) =>
    Number(r.qty || 0) * Number(r.sell_price || 0);

  const grandTotal = () =>
    rows.reduce((sum, r) => sum + lineTotal(r), 0);

  /* ---------------------- SELL ACTION ---------------------- */
  const handleSell = async (e) => {
    e.preventDefault();
    setInvoiceUrl(null);

    // Validate rows
    for (const row of rows) {
      if (!row.product_id) return alert("Select product in all rows");
      const qtyNum = Number(row.qty);
      const priceNum = Number(row.sell_price);
      if (Number.isNaN(qtyNum) || qtyNum <= 0) return alert("Quantity must be > 0");
      if (Number.isNaN(priceNum) || priceNum < 0) return alert("Enter a valid sell price");

      if (qtyNum > row.max_stock) {
        const ok = window.confirm(`${row.name} has only ${row.max_stock} left. Continue?`);
        if (!ok) return;
      }
    }

    // Validate customer
    if (!customer.customerName || !customer.customerPhone || !customer.customerEmail)
      return alert("Fill all customer details");

    const payload = {
      items: rows.map(r => ({
        product_id: Number(r.product_id),
        quantity: Number(r.qty),
        sell_price: Number(r.sell_price),
      })),
      customer_name: customer.customerName,
      customer_phone: customer.customerPhone,
      customer_email: customer.customerEmail,
    };

    setLoading(true);

    const res = await secureFetch(API_ENDPOINTS.SELL_PRODUCT, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.detail || "Sell failed");
      return;
    }

    alert("Sale completed!");

    setInvoiceUrl(API_ENDPOINTS.BASE_URL + data.invoice_pdf);

    // Reset form
    setRows([
      { id: Date.now(), product_id: "", qty: 1, sell_price: "", name: "", max_stock: 0 }
    ]);
    setCustomer({ customerName: "", customerPhone: "", customerEmail: "" });

    loadProducts();
  };

  /* ---------------------- UI ---------------------- */
  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3>Sell Products</h3>

          <form onSubmit={handleSell}>
            {rows.map(row => (
              <div key={row.id} className="d-flex gap-2 mb-2 align-items-center">
                
                {/* PRODUCT SELECT */}
                <select
                  className="form-control"
                  style={{ flex: 3 }}
                  value={row.product_id}
                  onChange={(e) => onProductChange(row.id, e.target.value)}
                >
                  <option value="">-- Select Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (stock: {p.quantity_in_stock})
                    </option>
                  ))}
                </select>

                {/* QTY */}
                <input
                  type="number"
                  className="form-control"
                  style={{ width: "100px" }}
                  value={row.qty}
                  onChange={(e) => onRowChange(row.id, "qty", e.target.value)}
                />

                {/* SELL PRICE */}
                <input
                  type="number"
                  className="form-control"
                  style={{ width: "140px" }}
                  value={row.sell_price}
                  onChange={(e) => onRowChange(row.id, "sell_price", e.target.value)}
                />

                <div style={{ width: "120px", textAlign: "right" }}>
                  {lineTotal(row).toLocaleString("en-IN")}
                </div>

                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  disabled={rows.length === 1}
                  onClick={() => removeRow(row.id)}
                >
                  Remove
                </button>
              </div>
            ))}

            <button type="button" className="btn btn-outline-primary btn-sm mb-3" onClick={addRow}>
              + Add Item
            </button>

            <hr />

            <h5>Customer Info</h5>

            <input
              className="form-control mb-2"
              placeholder="Customer Name"
              value={customer.customerName}
              onChange={(e) => setCustomer({ ...customer, customerName: e.target.value })}
            />

            <input
              className="form-control mb-2"
              placeholder="Phone"
              value={customer.customerPhone}
              onChange={(e) => setCustomer({ ...customer, customerPhone: e.target.value })}
            />

            <input
              className="form-control mb-3"
              placeholder="Email"
              value={customer.customerEmail}
              onChange={(e) => setCustomer({ ...customer, customerEmail: e.target.value })}
            />

            <div className="d-flex justify-content-between">
              <strong>Grand Total:</strong>
              <h4>₹{grandTotal().toLocaleString("en-IN")}</h4>
            </div>

            <button disabled={loading} className="btn btn-primary w-100 mt-3">
              {loading ? "Processing..." : "Sell & Generate Invoice"}
            </button>
          </form>

          {invoiceUrl && (
            <div className="alert alert-success mt-3">
              <h5>Invoice Ready</h5>
              <a href={invoiceUrl} target="_blank" rel="noreferrer" className="btn btn-success">
                Download Invoice
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellProduct;
