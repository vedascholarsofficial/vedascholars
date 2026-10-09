import axios from 'axios';
import Cookies from 'js-cookie';

// Set NEXT_PUBLIC_API_URL to the hosted Node.js API URL, including /api.
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : '/api')
).replace(/\/$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to attach the JWT dynamically
api.interceptors.request.use(
  (config) => {
    // We strictly use Cookies for the edge-compatibility required by NextJS Middleware, 
    // although localStorage is also populated in AuthContext for classic React paradigms.
    const token = Cookies.get('jwt_token') || (typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null);
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
