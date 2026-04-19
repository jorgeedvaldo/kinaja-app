import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/api';

/**
 * Axios instance configured for the KinaJá API.
 * Automatically attaches the Sanctum Bearer token from AsyncStorage.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
api.interceptors.request.use(
  async (config) => {
    console.log(`[API-REQUEST] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    try {
      const token = await AsyncStorage.getItem('@kinaja_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Error reading token from storage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 (token expired/invalid)
api.interceptors.response.use(
  (response) => {
    console.log(`[API-RESPONSE] ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  async (error) => {
    console.error(`[API-ERROR] ${error.response?.status || 'NETWORK'} ${error.config?.url}`, error.response?.data || error.message);
    if (error.response?.status === 401) {
      // Token is invalid/expired — clear stored auth
      await AsyncStorage.multiRemove(['@kinaja_token', '@kinaja_user']);
    }
    return Promise.reject(error);
  }
);

export default api;
