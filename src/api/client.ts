import axios from 'axios';
import { store } from '../store';
import { devLog } from "../utils/devLog";
import {getCurrentNetworkInfo, getNetworkInfo, initializeNetworkMonitoring } from '../services/network/networkInfo';
import { tokenService } from '../services/auth/tokenService';


const baseURL = 'https://nobiasmedia.onrender.com/api';
const timeOut = 10000;

const requestStartTimes = new WeakMap<object, number>();

const api = axios.create({
    baseURL,
    timeout: timeOut,
    withCredentials: true,
  });

  api.interceptors.request.use(async config => {
    const network = await initializeNetworkMonitoring();

    if (
      !network.isConnected ||
      network.isInternetReachable === false
    ) {
      const error = new Error('You are not connected to the internet.');
      error.name = 'NETWORK_UNAVAILABLE';
      throw error;
    }
  
  
    const token = tokenService.getAccessToken();

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
  
requestStartTimes.set(config, Date.now());

    return config;
  });

  api.interceptors.response.use(
    
    response => response,
    error => {
      if (error?.name === 'NETWORK_UNAVAILABLE') {
        devLog('Request skipped: device is offline');
        return Promise.reject(error);
      }
  
const startedAt = error?.config
? requestStartTimes.get(error.config)
: undefined;

devLog('API request duration (ms):',
startedAt ? Date.now() - startedAt : 'unknown',
);

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