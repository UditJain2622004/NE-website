// API Configuration
// For local development, this defaults to '/api' which is proxied by Vite
// For production, it uses the VITE_API_URL from environment variables

export const API_BASE = import.meta.env.VITE_API_URL || '/api';
