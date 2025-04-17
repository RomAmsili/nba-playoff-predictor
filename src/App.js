import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import BracketEdit from './pages/BracketEdit';
import NotFound from './pages/NotFound';

// Private route component
const PrivateRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/bracket/:bracketId" 
        element={
          <PrivateRoute>
            <BracketEdit />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/admin" 
        element={
          <PrivateRoute requireAdmin={true}>
            <AdminPanel />
          </PrivateRoute>
        } 
      />
      
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
