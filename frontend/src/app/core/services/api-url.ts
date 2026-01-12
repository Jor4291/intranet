// API URL utility for dynamic environment detection
export const getApiUrl = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Use relative API path for production (Vercel)
    if (hostname.includes('vercel.app') || hostname !== 'localhost') {
      return '/api';
    }
  }
  // Use localhost for development
  return 'http://localhost:8000/api';
};

export const apiUrl = getApiUrl();
