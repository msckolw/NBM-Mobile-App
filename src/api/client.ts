import axios from 'axios';
import { store } from '../store';

const baseURL = 'https://nobiasmedia.onrender.com/api';
const timeOut = 10000;

const api = axios.create({
    baseURL,
    timeout: timeOut,
    withCredentials: true,
  });

api.interceptors.request.use(config => {
  const token = store.getState().auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    console.log('API Error:', error?.response?.data);
    return Promise.reject(error);
  },
);

export default api;