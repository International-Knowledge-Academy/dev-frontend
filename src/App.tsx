// @ts-nocheck
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomeLayout from "layouts/home";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import ManagerLayout from "layouts/manager";

import HomePage from "views/home/default";
import AboutPage from "views/home/about";

import ProtectedRoute from "components/auth/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {/* Auth */}
      <Route path="auth/*" element={<AuthLayout />} />

      {/* Admin only */}
      <Route
        path="admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      />

      {/* Manager + Admin */}
      <Route
        path="manager/*"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager"]}>
            <ManagerLayout />
          </ProtectedRoute>
        }
      />

      {/* Unauthorized */}
      <Route
        path="unauthorized"
        element={
          <div className="flex h-screen items-center justify-center flex-col gap-3">
            <h1 className="text-3xl font-bold text-navy-700">403</h1>
            <p className="text-gray-500">You don't have access to this page.</p>
          </div>
        }
      />
    </Routes>
  );
};

export default App;
