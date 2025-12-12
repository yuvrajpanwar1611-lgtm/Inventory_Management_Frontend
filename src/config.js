// Centralized API configuration
// This allows easy switching between development, staging, and production environments

const API_BASE_URL = 
  process.env.REACT_APP_API_URL || 
  "https://inventory-management-ero4.onrender.com";

// Export API endpoints
export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/token`,
  SIGNUP: `${API_BASE_URL}/signup`,
  REGISTER: `${API_BASE_URL}/register`,
  USER_ME: `${API_BASE_URL}/users/me`,
  
  // OTP endpoints
  SEND_EMAIL_OTP: `${API_BASE_URL}/send-email-otp`,
  VERIFY_EMAIL_OTP: `${API_BASE_URL}/verify-email-otp`,
  SEND_PHONE_OTP: `${API_BASE_URL}/send-otp`,
  VERIFY_PHONE_OTP: `${API_BASE_URL}/verify-otp`,
  
  // Product endpoints
  PRODUCTS: `${API_BASE_URL}/product`,
  PRODUCT_BY_ID: (id) => `${API_BASE_URL}/product/${id}`,
  ADD_PRODUCT: (supplierId) => `${API_BASE_URL}/product/${supplierId}`,
  PURCHASE_PRODUCT: (productId) => `${API_BASE_URL}/product/purchase/${productId}`,
  SELL_PRODUCT: `${API_BASE_URL}/product/sell`,
  PRODUCT_MOVEMENTS: (productId) => `${API_BASE_URL}/product/${productId}/movements`,
  
  // Supplier endpoints
  SUPPLIERS: `${API_BASE_URL}/supplier`,
  SUPPLIER_BY_ID: (id) => `${API_BASE_URL}/supplier/${id}`,
  
  // Movement endpoints
  MOVEMENTS: `${API_BASE_URL}/movements`,
  
  // Invoice endpoints
  DOWNLOAD_INVOICE: (invoiceNumber) => `${API_BASE_URL}/download_invoice/${invoiceNumber}`,
};

export default API_ENDPOINTS;

