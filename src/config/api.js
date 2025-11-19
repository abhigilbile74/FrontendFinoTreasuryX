// Centralized API configuration for Vite + Render
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL_DEPLOY ||'https://finotreasuryx-1.onrender.com/api/';

// Ensure the base URL always ends with a single slash
export const API_BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;

export const getApiUrl = (endpoint = '') => {
  const normalizedEndpoint = endpoint.startsWith('/')
    ? endpoint.slice(1)
    : endpoint;

  return `${API_BASE_URL}${normalizedEndpoint}`;
};

