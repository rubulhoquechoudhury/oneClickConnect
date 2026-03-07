import axios from 'axios';

// In dev, always use /api so Vite proxy forwards to backend (no CORS). In production (dist), use VITE_API_URL.
const baseURL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL || '/api');

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export default api;
