import axios from 'axios';
import { store } from '../store';
import { devLog } from "../utils/devLog";
import {getCurrentNetworkInfo, getNetworkInfo } from '../services/network/networkInfo';


const baseURL = 'https://nobiasmedia.onrender.com/api';
const timeOut = 10000;

const api = axios.create({
    baseURL,
    timeout: timeOut,
    withCredentials: true,
  });

  api.interceptors.request.use(async config => {
    const network = getCurrentNetworkInfo();

    if (
      !network.isConnected ||
      network.isInternetReachable === false
    ) {
      devLog('API request blocked: No internet connection');
  
      const error = new Error('You are not connected to the internet.');
      error.name = 'NETWORK_UNAVAILABLE';
  
      return Promise.reject(error);
    }
  
    const token = store.getState().auth.token;
  
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  
    const safeHeaders = {...config.headers};
    delete safeHeaders.Authorization;
  
    let safeData = config.data;
  
    if (typeof safeData === 'object' && safeData !== null) {
      safeData = {...safeData};
  
      // Never log authentication credentials
      delete safeData.accessToken;
      delete safeData.access_token;
      delete safeData.idToken;
      delete safeData.token;
      delete safeData.password;
    }
  
    devLog('========== API REQUEST ==========');
    devLog('method:', config.method?.toUpperCase());
    devLog('url:', `${config.baseURL}${config.url}`);
    devLog('headers:', safeHeaders);
    devLog('body:', safeData);
    devLog('=================================');
  
    return config;
  });

  api.interceptors.response.use(
    response => response,
    error => {
      if (error?.name === 'NETWORK_UNAVAILABLE') {
        devLog('Request skipped: device is offline');
        return Promise.reject(error);
      }
  
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