# Inventory Management Frontend (React)

A React-based frontend for the Inventory Management system.

## Features

- User authentication with JWT
- Email and Phone OTP verification
- Product management
- Supplier management
- Stock purchase and sales
- Invoice generation and download
- Stock movement tracking
- Responsive UI with Bootstrap

## Setup

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure API URL (optional):
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=https://inventory-management-ero4.onrender.com
   ```
   If not set, defaults to production URL.

3. Start development server:
   ```bash
   npm start
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Configuration

API endpoints are centralized in `src/config.js`. To change the backend URL:

1. Set `REACT_APP_API_URL` environment variable, OR
2. Edit `src/config.js` and change the `API_BASE_URL` default value

## Recent Fixes

- ✅ Centralized API URL configuration
- ✅ All components now use centralized config
- ✅ Improved OTP verification error handling
- ✅ Better error messages and user feedback
- ✅ Fixed invoice download links

## Project Structure

- `src/config.js` - Centralized API configuration
- `src/AuthContext.js` - Authentication context
- `src/components/` - React components
- `src/useSecureFetch.js` - Secure fetch hook with auth headers 
