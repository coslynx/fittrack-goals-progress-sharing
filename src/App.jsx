import React, { useContext, useCallback, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Header from './components/Header';

const App = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state, replace with actual loading check if needed
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }

    return children;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;