// src/useSecureFetch.js
import { useCallback, useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useSecureFetch() {
  const { token, logout } = useContext(AuthContext);

  return useCallback(async (url, options = {}) => {
    // Merge headers without forcing JSON content-type (supports file downloads, form posts, etc.)
    const headers = {
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization = "Bearer " + token;
    }

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401 && token) {
      // Do not auto-logout; surface the error and let caller decide.
      console.warn("Auth 401 from API; not logging out automatically.");
    }

    return res;
  }, [token]);
}

// Support both default and named imports across the app
export default useSecureFetch;
