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
  
    console.log('========== API REQUEST ==========');
    console.log('method:', config.method);
    console.log('baseURL:', config.baseURL);
    console.log('url:', config.url);
    console.log('=================================');
  
    return config;
  });

api.interceptors.response.use(
  response => response,
  error => {
    console.log('========== API ERROR ==========');
    console.log('message:', error?.message);
    console.log('code:', error?.code);
    console.log('url:', error?.config?.url);
    console.log('baseURL:', error?.config?.baseURL);
    console.log('method:', error?.config?.method);
    console.log('timeout:', error?.config?.timeout);
    console.log('status:', error?.response?.status);
    console.log('response:', error?.response?.data);
    console.log('request:', error?.request);
    console.log('================================');

    return Promise.reject(error);
  },
);



export default api;