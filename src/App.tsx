// @ts-nocheck
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomeLayout from "layouts/home";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import ManagerLayout from "layouts/manager";

import HomePage from "views/home/default";
import AboutPage from "views/home/about";
import TrainingPage from "views/home/training";
import ContactPage from "views/home/contact";
import ProgramsPublicPage from "views/home/programs";
import ProgramPage from "views/home/programs/ProgramPage";
import CategoriesHubPage from "views/home/categories";
import CategoryTypePage from "views/home/categories/CategoryTypePage";
import CategoryDetailPage from "views/home/categories/CategoryDetailPage";
import RegisterPage from "views/home/register/program";
import RegisterSuccessPage from "views/home/register/program/SuccessPage";
import RegisterTrainerPage from "views/home/register/trainer";
import TrainerApplicationSuccessPage from "views/home/register/trainer/SuccessPage";
import VerifyCertificatePage from "views/home/verify";

import ProtectedRoute from "components/auth/ProtectedRoute";

// Set to false when ready to go live
const COMING_SOON = false;

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
        {!COMING_SOON && (
          <>
            <Route path="/about" element={<AboutPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/programs" element={<ProgramsPublicPage />} />
            <Route path="/programs/:uid" element={<ProgramPage />} />
            <Route path="/categories" element={<CategoriesHubPage />} />
            <Route path="/categories/:typeSlug" element={<CategoryTypePage />} />
            <Route path="/category/:uid" element={<CategoryDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/program" element={<RegisterPage />} />
            <Route path="/register/success" element={<RegisterSuccessPage />} />
            <Route path="/register/trainer" element={<RegisterTrainerPage />} />
            <Route path="/register/trainer/success" element={<TrainerApplicationSuccessPage />} />
            <Route path="/verify" element={<VerifyCertificatePage />} />
            <Route path="/verify/:verification_code" element={<VerifyCertificatePage />} />
          </>
        )}
      </Route>

      {/* Auth */}
      {COMING_SOON ? (
        <Route path="auth/*" element={<Navigate to="/" replace />} />
      ) : (
        <Route path="auth/*" element={<AuthLayout />} />
      )}

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
        path="account-manager/*"
        element={
          <ProtectedRoute allowedRoles={["admin", "account_manager"]}>
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
            <p className="text-slate-500">You don't have access to this page.</p>
          </div>
        }
      />

      {/* Catch-all → Coming Soon */}
      {COMING_SOON && <Route path="*" element={<Navigate to="/" replace />} />}
    </Routes>
  );
};

export default App;
