// API URL utility for dynamic environment detection
export const getApiUrl = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isVercel = hostname.includes('vercel.app') || hostname.includes('intranet');
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

    console.log('API URL Detection:', { hostname, isVercel, isLocalhost });

    // Use relative API path for production (Vercel or any deployment)
    if (isVercel || !isLocalhost) {
      console.log('Using production API URL: /api');
      return '/api';
    }

    // Use localhost for development
    console.log('Using development API URL: http://localhost:8000/api');
    return 'http://localhost:8000/api';
  }
  // Use localhost for development (server-side)
  console.log('Using server-side development API URL: http://localhost:8000/api');
  return 'http://localhost:8000/api';
};

// Export the function so it can be called dynamically
export const getCurrentApiUrl = getApiUrl;

// For backward compatibility, still export a constant that calls the function
export const apiUrl = getApiUrl();
