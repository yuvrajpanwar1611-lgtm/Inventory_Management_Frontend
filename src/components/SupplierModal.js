// src/components/SupplierModal.js
import React from "react";

const SupplierModal = ({ open, loading, supplier, onClose }) => {
  if (!open) return null;

  const noSupplier = !loading && (!supplier || Object.keys(supplier).length === 0);

  return (
    <>
      {/* BACKDROP */}
      <div className="modal-backdrop fade show"></div>

      {/* MODAL WRAPPER */}
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex="-1"
        onClick={onClose}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <div className="modal-content shadow">

            {/* HEADER */}
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Supplier Details</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              ></button>
            </div>

            {/* BODY */}
            <div className="modal-body">
              {/* LOADING STATE */}
              {loading && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary"></div>
                </div>
              )}

              {/* NO SUPPLIER FOUND */}
              {noSupplier && (
                <div className="alert alert-warning text-center">
                  Supplier not found or this product has no supplier assigned.
                </div>
              )}

              {/* SUPPLIER DATA */}
              {!loading && supplier && !noSupplier && (
                <>
                  <p><strong>Name:</strong> {supplier.name}</p>
                  <p><strong>Company:</strong> {supplier.company}</p>
                  <p><strong>Email:</strong> {supplier.email}</p>
                  <p><strong>Phone:</strong> {supplier.phone}</p>

                  {/* CONTACT BUTTONS */}
                  <div className="d-flex gap-2 mt-3">
                    {supplier.email && (
                      <a
                        className="btn btn-primary"
                        href={`mailto:${supplier.email}`}
                      >
                        Email
                      </a>
                    )}
                    {supplier.phone && (
                      <a
                        className="btn btn-success"
                        href={`tel:${supplier.phone}`}
                      >
                        Call
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default SupplierModal;
