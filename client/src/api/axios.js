import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Ensures httpOnly cookies are sent with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;