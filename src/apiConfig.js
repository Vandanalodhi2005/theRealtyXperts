const PRODUCTION_BACKEND = 'https://backend-realtyexperts.vercel.app';

const getBackendUrl = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL;

  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }

  return PRODUCTION_BACKEND;
};

export const API_URL = getBackendUrl();
