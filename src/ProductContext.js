// src/ProductContext.js
import React, { createContext, useState } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // Provide tuple to match consumer usage: [products, setProducts]
  const [products, setProducts] = useState({ data: [] });

  return (
    <ProductContext.Provider value={[products, setProducts]}>
      {children}
    </ProductContext.Provider>
  );
};
