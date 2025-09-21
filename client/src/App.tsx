import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { EmployeeDashboard } from '@/pages/EmployeeDashboard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  const { initializeAuth, isAuthenticated, user, isLoading } = useAuthStore();

  console.log({ initializeAuth, isAuthenticated, user })

  useEffect(() => {
    initializeAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Router basename="/alpha">
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              {user?.role === 'employee' ? (
                <Navigate to="/employee" replace />
              )
                :
                user?.role === 'admin' ? (
                  <Navigate to="/admin" replace />
                )
                  :
                  (
                    <Navigate to="/login" replace />
                  )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;