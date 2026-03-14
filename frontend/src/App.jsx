import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Landing
import LandingPage from './pages/landing/LandingPage';

// Auth pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AdminLogin from './pages/auth/AdminLogin';

// User dashboard
import UserDashboard from './pages/user/UserDashboard';
import UserOverview from './pages/user/UserOverview';
import ApplyAdmission from './pages/user/ApplyAdmission';
import MyApplications from './pages/user/MyApplications';
import UploadDocuments from './pages/user/UploadDocuments';
import TrackStatus from './pages/user/TrackStatus';
import UserNotifications from './pages/user/UserNotifications';
import UserProfile from './pages/user/UserProfile';

// Admin dashboard
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOverview from './pages/admin/AdminOverview';
import AllApplicants from './pages/admin/AllApplicants';
import ProgramsManagement from './pages/admin/ProgramsManagement';
import DocumentVerification from './pages/admin/DocumentVerification';
import AIScreening from './pages/admin/AIScreening';
import FraudDetection from './pages/admin/FraudDetection';
import AdmissionDecisions from './pages/admin/AdmissionDecisions';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import AdminNotifications from './pages/admin/AdminNotifications';

// Protected Route components
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0f0e17]">
    <div className="spinner w-10 h-10" />
  </div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0f0e17]">
    <div className="spinner w-10 h-10" />
  </div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (isAuthenticated) return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />

      {/* User Dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>}>
        <Route index element={<UserOverview />} />
        <Route path="apply" element={<ApplyAdmission />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="documents" element={<UploadDocuments />} />
        <Route path="status" element={<TrackStatus />} />
        <Route path="notifications" element={<UserNotifications />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {/* Admin Dashboard */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
        <Route index element={<AdminOverview />} />
        <Route path="applicants" element={<AllApplicants />} />
        <Route path="programs" element={<ProgramsManagement />} />
        <Route path="documents" element={<DocumentVerification />} />
        <Route path="ai-screening" element={<AIScreening />} />
        <Route path="fraud" element={<FraudDetection />} />
        <Route path="decisions" element={<AdmissionDecisions />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="notifications" element={<AdminNotifications />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
