import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/categories/Categories';
import Transactions from './pages/transactions/Transactions';
import Layout from './components/layout/Layout';
import { useAuthStore } from './stores/authStore'; // Import your store
import { useThemeStore } from './stores/themeStore';

const isAuthenticated = () => {
  const { isAuthenticated } = useAuthStore.getState(); // Access state from your auth store
  return isAuthenticated; // Check if the user is authenticated using the store state
};

function App() {
  const { theme } = useThemeStore();

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-blue-950 transition-colors duration-300">
        <Router>
          <Routes>
            <Route path="/login" element={!isAuthenticated() ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated() ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/" element={isAuthenticated() ? <Layout /> : <Navigate to="/login" />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="categories" element={<Categories />} />
              <Route path="transactions" element={<Transactions />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default App;
