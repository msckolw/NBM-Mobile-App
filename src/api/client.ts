import axios from 'axios';
import { store } from '../store';
import { devLog } from "../utils/devLog";


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
  
    devLog('========== API REQUEST ==========');
    devLog('method:', config.method);
    devLog('baseURL:', config.baseURL);
    devLog('url:', config.url);
    devLog('=================================');
  
    return config;
  });

api.interceptors.response.use(
  response => response,
  error => {
    devLog('========== API ERROR ==========');
    devLog('message:', error?.message);
    devLog('code:', error?.code);
    devLog('url:', error?.config?.url);
    devLog('baseURL:', error?.config?.baseURL);
    devLog('method:', error?.config?.method);
    devLog('timeout:', error?.config?.timeout);
    devLog('status:', error?.response?.status);
    devLog('response:', error?.response?.data);
    devLog('request:', error?.request);
    devLog('================================');

    return Promise.reject(error);
  },
);



export default api;