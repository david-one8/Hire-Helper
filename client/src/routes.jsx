import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

// Auth Pages
import Login from '@pages/auth/Login';
import Register from '@pages/auth/Register';
import VerifyEmail from '@pages/auth/VerifyEmail';

// Dashboard Pages
import Feed from '@pages/dashboard/Feed';
import MyTasks from '@pages/dashboard/MyTasks';
import Requests from '@pages/dashboard/Requests';
import MyRequests from '@pages/dashboard/MyRequests';
import AddTask from '@pages/dashboard/AddTask';
import Settings from '@pages/dashboard/Settings';
import NotFound from '@pages/NotFound';

// Layouts
import DashboardLayout from '@components/layout/DashboardLayout';
import AuthLayout from '@components/layout/AuthLayout';

const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verify" element={<VerifyEmail />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/feed" replace />} />
        <Route path="feed" element={<Feed />} />
        <Route path="my-tasks" element={<MyTasks />} />
        <Route path="requests" element={<Requests />} />
        <Route path="my-requests" element={<MyRequests />} />
        <Route path="add-task" element={<AddTask />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
