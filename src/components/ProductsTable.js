// src/components/ProductsTable.js
import React, { useEffect, useContext, useState, useCallback } from "react";
import { ProductContext } from "../ProductContext";
import { UpdateProductContext } from "../UpdateProductContext";
import ProductRow from "./ProductRow";
import SupplierModal from "./SupplierModal";
import { useNavigate } from "react-router-dom";
import { useSecureFetch } from "../useSecureFetch";
import { API_ENDPOINTS } from "../config";

const ProductsTable = () => {
  const [products, setProducts] = useContext(ProductContext);
  const [, setUpdateProductInfo] = useContext(UpdateProductContext);

  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [supplierLoading, setSupplierLoading] = useState(false);
  const [supplierData, setSupplierData] = useState(null);

  const secureFetch = useSecureFetch();  // ✅ Correct usage
  const navigate = useNavigate();

  /* ---------------- FETCH PRODUCTS ---------------- */
  const fetchProducts = useCallback(async () => {
    const res = await secureFetch(API_ENDPOINTS.PRODUCTS);

    if (!res.ok) return;

    const data = await res.json();
    setProducts({ data: data.data || [] });
  }, [secureFetch, setProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ---------------- EDIT HANDLER ---------------- */
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

  /* ---------------- DELETE HANDLER ---------------- */
  const handleDelete = async (p) => {
    if (!window.confirm("Delete this product?")) return;

    const res = await secureFetch(API_ENDPOINTS.PRODUCT_BY_ID(p.id), {
      method: "DELETE",
    });

    if (res.ok) {
      setProducts((prev) => ({
        data: prev.data.filter((x) => x.id !== p.id),
      }));
      alert("Product deleted");
    }
  };

  /* ---------------- VIEW SUPPLIER ---------------- */
  const handleViewSupplier = async (supplierId) => {
    if (!supplierId) {
      alert("No supplier linked to this product.");
      return;
    }

    setSupplierModalOpen(true);
    setSupplierLoading(true);

    try {
      const res = await secureFetch(API_ENDPOINTS.SUPPLIER_BY_ID(supplierId));

      const json = await res.json();
      setSupplierData(json.data || null);
    } catch (err) {
      alert("Failed to load supplier details");
      setSupplierModalOpen(false);
    }

    setSupplierLoading(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3 fw-bold">Products</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center align-middle shadow">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Supplier</th>
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
                    supplier_name: p.supplied_by?.name || "—",
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
