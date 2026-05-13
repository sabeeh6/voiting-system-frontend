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
import CandidateManagement from "./pages/admin/CandidateManagement";
import UserManagement from "./pages/admin/UserManagement";
import ElectionManagement from "./pages/admin/ElectionManagement";
import ElectionAnalytics from "./pages/admin/ElectionAnalytics";
import VoterElections from "./pages/voter/VoterElections";
import BallotSubmission from "./pages/voter/BallotSubmission";
import VoterHistory from "./pages/voter/VoterHistory";
import UserProfile from "./pages/dashboard/UserProfile";

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
              <Route path="/dashboard/elections" element={<VoterElections />} />
              <Route path="/dashboard/vote/:electionId" element={<BallotSubmission />} />
              <Route path="/dashboard/history" element={<VoterHistory />} />
              <Route path="/dashboard/profile" element={<UserProfile />} />
            </Route>
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/elections" element={<ElectionManagement />} />
              <Route path="/admin/analytics/:electionId" element={<ElectionAnalytics />} />
              <Route path="/admin/candidates" element={<CandidateManagement />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/settings" element={<div className="text-white">System Settings (Coming Soon)</div>} />
              <Route path="/admin/profile" element={<UserProfile />} />
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
