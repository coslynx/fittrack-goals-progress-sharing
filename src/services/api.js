```javascript
// src/services/api.js

import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Define the base URL for the API
const baseURL = '/api';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to handle GET requests
/**
 * Performs a GET request to the specified URL.
 * @param {string} url - The URL to make the GET request to.
 * @param {object} [config] - Optional configuration for the request.
 * @returns {Promise<any>} - A Promise that resolves with the response data or rejects with an error.
 */
const get = async (url, config) => {
  try {
    const response = await api.get(url, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to handle POST requests
/**
 * Performs a POST request to the specified URL.
 * @param {string} url - The URL to make the POST request to.
 * @param {object} data - The data to send in the POST request.
 * @param {object} [config] - Optional configuration for the request.
 * @returns {Promise<any>} - A Promise that resolves with the response data or rejects with an error.
 */
const post = async (url, data, config) => {
  try {
    const response = await api.post(url, data, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to handle PUT requests
/**
 * Performs a PUT request to the specified URL.
 * @param {string} url - The URL to make the PUT request to.
 * @param {object} data - The data to send in the PUT request.
 * @param {object} [config] - Optional configuration for the request.
 * @returns {Promise<any>} - A Promise that resolves with the response data or rejects with an error.
 */
const put = async (url, data, config) => {
  try {
    const response = await api.put(url, data, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to handle DELETE requests
/**
 * Performs a DELETE request to the specified URL.
 * @param {string} url - The URL to make the DELETE request to.
 * @param {object} [config] - Optional configuration for the request.
 * @returns {Promise<any>} - A Promise that resolves with the response data or rejects with an error.
 */
const del = async (url, config) => {
  try {
    const response = await api.delete(url, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API error:', error.response.data);
    throw {
      status: error.response.status,
      message: error.response.data.message || 'API error',
    };
  } else if (error.request) {
    // The request was made but no response was received
    console.error('Network error:', error.message);
    throw new Error('Network error');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Request setup error:', error.message);
    throw new Error('Request setup error');
  }
};

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // AuthContext might not be available, handle gracefully
      console.warn('AuthContext not available:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem('token');
        const refreshResponse = await axios.post('/api/auth/refresh', { token: refreshToken });

        if (refreshResponse.status === 200) {
          const newToken = refreshResponse.data.token;
          localStorage.setItem('token', newToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Token refresh failed, redirect to login
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('token');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export { get, post, put, del };

// Example Usage:
/**
 * // Example of a GET request
 * api.get('/api/goals')
 *   .then(data => console.log('Goals:', data))
 *   .catch(error => console.error('Error fetching goals:', error));
 *
 * // Example of a POST request
 * api.post('/api/goals', { name: 'New Goal', target: 'Achieve this' })
 *   .then(data => console.log('New goal created:', data))
 *   .catch(error => console.error('Error creating goal:', error));
 */
```