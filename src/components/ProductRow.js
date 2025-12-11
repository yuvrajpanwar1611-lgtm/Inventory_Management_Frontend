// src/components/ProductRow.js
import React from "react";

const ProductRow = ({ product, onEdit, onDelete, onViewSupplier }) => {
  // Safe Currency Formatting
  const formatCurrency = (value) => {
    const num = Number(value);
    if (isNaN(num)) return "₹0";
    return "₹" + num.toLocaleString("en-IN");
  };

  return (
    <tr>
      <td>{product.id}</td>
      <td>{product.name || "—"}</td>

      <td>{product.quantity_in_stock ?? 0}</td>
      <td>{product.quantity_sold ?? 0}</td>

      {/* Unit Price */}
      <td>{formatCurrency(product.unit_price)}</td>

      {/* Revenue */}
      <td>{formatCurrency(product.revenue)}</td>

      {/* Net Profit */}
      <td
        className={
          Number(product.net_profit) > 0
            ? "text-success fw-bold"
            : "text-danger fw-bold"
        }
      >
        {formatCurrency(product.net_profit)}
      </td>

      {/* ACTION BUTTONS */}
      <td className="text-center">

        {/* Supplier Button */}
        <button
          className="btn btn-info btn-sm me-2"
          disabled={!product.supplied_by_id}
          onClick={() => product.supplied_by_id && onViewSupplier(product.supplied_by_id)}
        >
          {product.supplied_by_id ? "Supplier" : "No Supplier"}
        </button>

        {/* Edit Button */}
        <button
          className="btn btn-warning btn-sm me-2"
          onClick={() => onEdit(product)}
        >
          Edit
        </button>

        {/* Delete Button */}
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(product)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;
