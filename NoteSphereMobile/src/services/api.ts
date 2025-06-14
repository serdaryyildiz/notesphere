import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../config';
// import { Platform } from 'react-native';


console.log('Using BASE_URL:', BASE_URL);

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.log('Making request to:', `${config.baseURL}${config.url}`);
    
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    const endTime = Date.now();
    console.log(`[${endTime}] Response received:`, {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
    });
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error Details:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
      config: error.config ? {
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers,
        timeout: error.config.timeout,
        baseURL: error.config.baseURL,
      } : 'No config available',
    });

    if (error.response) {
      console.error('Server Response Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error('No Response Error:', {
        _response: error.request._response,
        _url: error.request._url,
        _trackingName: error.request._trackingName,
        _incrementalEvents: error.request._incrementalEvents,
      });
    }

    return Promise.reject(error);
  }
);

export const authService = {
  test: async () => {
    try {
      console.log('Now trying with axios...');
      const response = await api.get('/auth/test');
      console.log('Axios test response:', response.data);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Test error details:', {
          message: error.message,
          code: (error as AxiosError).code,
          stack: error.stack,
        });
      }
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/signin', { usernameOrEmail: email, password });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
  }) => {
    try {
      console.log('Sending register request with data:', userData);
      const response = await api.post('/auth/signup', userData);
      console.log('Register response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
  },
};

export const repositoryService = {
  create: async (data: { name: string; description?: string }) => {
    try {
      const response = await api.post('/repositories', data);
      return response.data;
    } catch (error) {
      console.error('Repository create error:', error);
      throw error;
    }
  },
  list: async () => {
    try {
      const response = await api.get('/repositories');
      return response.data;
    } catch (error) {
      console.error('Repository list error:', error);
      throw error;
    }
  },
  addNote: async (repositoryId: string, data: { title: string; content: string }) => {
    try {
      const response = await api.post(`/repositories/${repositoryId}/notes`, data);
      return response.data;
    } catch (error) {
      console.error('Add note error:', error);
      throw error;
    }
  },
  listNotes: async (repositoryId: string) => {
    try {
      const response = await api.get(`/repositories/${repositoryId}/notes`);
      return response.data;
    } catch (error) {
      console.error('List notes error:', error);
      throw error;
    }
  },
};

export default api; 