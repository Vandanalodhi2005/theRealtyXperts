const getBackendUrl = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  
  // If we're on the production domain but the env points to localhost,
  // automatically use the production backend URL.
  if (window.location.hostname !== 'localhost' && (!envUrl || envUrl.includes('localhost'))) {
    return 'https://backend-realtyexperts.vercel.app';
  }
  
  return envUrl || 'https://backend-realtyexperts.vercel.app';
};

export const API_URL = getBackendUrl();
