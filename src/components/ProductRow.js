// src/components/ProductRow.js
import React from "react";

const ProductRow = ({ product, onEdit, onDelete, onViewSupplier }) => {

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "₹0";
    return "₹" + Number(value).toLocaleString("en-IN");
  };

  return (
    <tr>
      <td>{product.id}</td>
      <td>{product.name}</td>
      <td>{product.quantity_in_stock}</td>
      <td>{product.quantity_sold}</td>

      <td>{formatCurrency(product.unit_price)}</td>
      <td>{formatCurrency(product.revenue)}</td>

      <td
        className={
          Number(product.net_profit) > 0 ? "text-success fw-bold" : "text-danger fw-bold"
        }
      >
        {formatCurrency(product.net_profit)}
      </td>

      <td className="text-center">
        {/* Supplier Button */}
        <button
          className="btn btn-info btn-sm me-2"
          disabled={!product.supplied_by_id}
          onClick={() => onViewSupplier(product.supplied_by_id)}
        >
          Supplier
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
