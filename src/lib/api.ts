import axios from 'axios';
import Cookies from 'js-cookie';

// Create a central API instance mapping to your Node.js backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
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
