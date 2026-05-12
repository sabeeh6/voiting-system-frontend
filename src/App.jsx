import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/guards/ProtectedRoute";
import AdminRoute from "./components/guards/AdminRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VoterDashboard from "./pages/dashboard/VoterDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Voter Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<VoterDashboard />} />
              <Route path="/dashboard/elections" element={<div className="text-white">Elections Page (Coming Soon)</div>} />
              <Route path="/dashboard/history" element={<div className="text-white">Vote History (Coming Soon)</div>} />
              <Route path="/dashboard/profile" element={<div className="text-white">User Profile (Coming Soon)</div>} />
            </Route>
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/elections" element={<div className="text-white">Election Management (Coming Soon)</div>} />
              <Route path="/admin/candidates" element={<div className="text-white">Candidate Management (Coming Soon)</div>} />
              <Route path="/admin/users" element={<div className="text-white">User Management (Coming Soon)</div>} />
              <Route path="/admin/settings" element={<div className="text-white">System Settings (Coming Soon)</div>} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
