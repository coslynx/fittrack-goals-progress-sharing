```javascript
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const sanitizeInput = useCallback((input) => {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }, []);

  const login = useCallback(async (email, password) => {
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    try {
      const response = await axios.post('/api/auth/login', {
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      if (response.status === 200) {
        const { token, user: userData } = response.data;
        localStorage.setItem('token', token);
        setUser(userData);
        setIsAuthenticated(true);
        setError(null);
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      console.error('Login failed:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [navigate, sanitizeInput]);

  const signup = useCallback(async (email, password) => {
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    try {
      const response = await axios.post('/api/auth/register', {
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      if (response.status === 201) {
        const { token, user: userData } = response.data;
        localStorage.setItem('token', token);
        setUser(userData);
        setIsAuthenticated(true);
        setError(null);
        navigate('/dashboard');
      } else {
        setError('Signup failed');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      console.error('Signup failed:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [navigate, sanitizeInput]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
    navigate('/');
  }, [navigate]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('/api/auth/validate');

        if (response.status === 200) {
          setUser(response.data.user);
          setIsAuthenticated(true);
          setError(null);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('token');
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      console.error('Authentication check failed:', err.response ? err.response.data : err.message);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const value = {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};
```