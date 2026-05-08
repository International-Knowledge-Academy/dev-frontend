// @ts-nocheck
import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "components/sidebar";
import ManagerTopbar from "components/manager/Topbar";
import routes from "routes";

import ManagerDashboard        from "views/account-manager/default";
import ManagerProfile          from "views/account-manager/profile";
import TrainersPage            from "views/account-manager/trainers";
import TrainerCreatePage       from "views/account-manager/trainers/TrainerCreatePage";
import TrainerEditPage         from "views/account-manager/trainers/TrainerEditPage";
import TrainerProfilePage      from "views/account-manager/trainers/TrainerProfilePage";
import LocationsIndexPage      from "views/account-manager/locations";
import LocationCreatePage      from "views/account-manager/locations/LocationCreatePage";
import LocationDetailPage      from "views/account-manager/locations/LocationDetailPage";
import LocationEditPage        from "views/account-manager/locations/LocationEditPage";
import CategoriesIndexPage     from "views/account-manager/categories";
import CategoryCreatePage      from "views/account-manager/categories/CategoryCreatePage";
import CategoryDetailPage      from "views/account-manager/categories/CategoryDetailPage";
import CategoryEditPage        from "views/account-manager/categories/CategoryEditPage";
import ProgramsPage            from "views/account-manager/programs";
import ProgramCreatePage       from "views/account-manager/programs/ProgramCreatePage";
import ProgramEditPage         from "views/account-manager/programs/ProgramEditPage";
import ProgramDetailPage       from "views/account-manager/programs/ProgramDetailPage";
import FieldsIndexPage         from "views/account-manager/fields";
import FieldCreatePage         from "views/account-manager/fields/FieldCreatePage";
import FieldEditPage           from "views/account-manager/fields/FieldEditPage";
import FieldDetailPage         from "views/account-manager/fields/FieldDetailPage";
import RegistrationsPage       from "views/account-manager/registrations";
import RegistrationDetailPage  from "views/account-manager/registrations/RegistrationDetailPage";
import RegistrationEditPage    from "views/account-manager/registrations/RegistrationEditPage";
import PaymentsPage            from "views/account-manager/payments";
import PaymentCreatePage       from "views/account-manager/payments/PaymentCreatePage";
import PaymentDetailPage       from "views/account-manager/payments/PaymentDetailPage";
import PaymentEditPage         from "views/account-manager/payments/PaymentEditPage";

const ManagerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const getActiveRoute = () => {
    for (const r of routes) {
      if (r.layout === "/account-manager" && pathname.includes(`/account-manager/${r.path}`)) {
        return r.name;
      }
    }
    return "Manager";
  };

  return (
    <div className="flex h-full min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 xl:ml-[276px]">
        <div className="min-h-screen p-4 md:p-6">
          <ManagerTopbar
            onOpenSidebar={() => setSidebarOpen(true)}
            pageTitle={getActiveRoute()}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: -6,              transition: { duration: 0.12, ease: [0.4, 0, 1, 1] } }}
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            >
          <Routes>
            {/* Top-level */}
            <Route path="dashboard"  element={<ManagerDashboard />} />
            <Route path="profile"    element={<ManagerProfile />} />

            {/* Programs */}
            <Route path="programs"             element={<ProgramsPage />} />
            <Route path="programs/create"      element={<ProgramCreatePage />} />
            <Route path="programs/:uid"        element={<ProgramDetailPage />} />
            <Route path="programs/:uid/edit"   element={<ProgramEditPage />} />

            {/* Registrations */}
            <Route path="registrations"            element={<RegistrationsPage />} />
            <Route path="registrations/:id"        element={<RegistrationDetailPage />} />
            <Route path="registrations/:id/edit"   element={<RegistrationEditPage />} />

            {/* Payments */}
            <Route path="payments"           element={<PaymentsPage />} />
            <Route path="payments/create"    element={<PaymentCreatePage />} />
            <Route path="payments/:id"       element={<PaymentDetailPage />} />
            <Route path="payments/:id/edit"  element={<PaymentEditPage />} />

            {/* Trainers */}
            <Route path="trainers"             element={<TrainersPage />} />
            <Route path="trainers/create"      element={<TrainerCreatePage />} />
            <Route path="trainers/:uid"        element={<TrainerProfilePage />} />
            <Route path="trainers/:uid/edit"   element={<TrainerEditPage />} />

            {/* Categories */}
            <Route path="categories"             element={<CategoriesIndexPage />} />
            <Route path="categories/create"      element={<CategoryCreatePage />} />
            <Route path="categories/:uid"        element={<CategoryDetailPage />} />
            <Route path="categories/:uid/edit"   element={<CategoryEditPage />} />

            {/* Fields */}
            <Route path="fields"             element={<FieldsIndexPage />} />
            <Route path="fields/create"      element={<FieldCreatePage />} />
            <Route path="fields/:uid"        element={<FieldDetailPage />} />
            <Route path="fields/:uid/edit"   element={<FieldEditPage />} />

            {/* Locations */}
            <Route path="locations"             element={<LocationsIndexPage />} />
            <Route path="locations/create"      element={<LocationCreatePage />} />
            <Route path="locations/:uid"        element={<LocationDetailPage />} />
            <Route path="locations/:uid/edit"   element={<LocationEditPage />} />

            <Route path="/" element={<Navigate to="/account-manager/dashboard" replace />} />
          </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ManagerLayout;
