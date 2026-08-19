import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { SimulationProvider } from './context/SimulationContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LiveMonitoringPage from './pages/LiveMonitoringPage';
import AnimalDetectionPage from './pages/AnimalDetectionPage';
import AlertsPage from './pages/AlertsPage';
import IncidentsPage from './pages/IncidentsPage';
import IncidentDetailsPage from './pages/IncidentDetailsPage';
import MapPage from './pages/MapPage';
import SensorManagementPage from './pages/SensorManagementPage';
import ResidentDashboardPage from './pages/ResidentDashboardPage';
import ReportSightingPage from './pages/ReportSightingPage';
import SightingsPage from './pages/SightingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import UserManagementPage from './pages/UserManagementPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-950 text-emerald-400 font-mono text-xs">
        Validating Security Credentials...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <SimulationProvider>
            <Routes>
              {/* Public Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Route>

              {/* Main Application Routes */}
              <Route element={<MainLayout />}>
                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Role-Based Dashboard & Portals */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/live-monitoring"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'officer']}>
                      <LiveMonitoringPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/map"
                  element={
                    <ProtectedRoute>
                      <MapPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/alerts"
                  element={
                    <ProtectedRoute>
                      <AlertsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/detections"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'officer']}>
                      <AnimalDetectionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/incidents"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'officer']}>
                      <IncidentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/incidents/:id"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'officer']}>
                      <IncidentDetailsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sensors"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'officer']}>
                      <SensorManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resident-portal"
                  element={
                    <ProtectedRoute>
                      <ResidentDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/report-sighting"
                  element={
                    <ProtectedRoute>
                      <ReportSightingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sightings"
                  element={
                    <ProtectedRoute>
                      <SightingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'officer']}>
                      <AnalyticsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'officer']}>
                      <ReportsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <UserManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </SimulationProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
