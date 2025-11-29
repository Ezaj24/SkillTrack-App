import axios from 'axios';

const API_BASE_URL = 'https://skilltrack-api.onrender.com';

// Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// --- Store token in axios for authenticated requests ---
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};
