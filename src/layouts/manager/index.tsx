import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "components/sidebar";
import ManagerTopbar from "components/manager/Topbar";
import ManagerDashboard from "views/manager/dashboard";
import ManagerProfile from "views/manager/profile";

const pageTitles: Record<string, string> = {
  "/account-manager/dashboard":        "Dashboard",
  "/account-manager/profile":          "My Profile",
  "/account-manager/change-password":  "Change Password",
};

const ManagerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const pageTitle = pageTitles[pathname] ?? "Manager";

  return (
    <div className="flex h-full min-h-screen bg-slate-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content — offset by sidebar width on xl */}
      <div className="flex-1 xl:ml-[276px]">
        <div className="min-h-screen p-4 md:p-6">
          <ManagerTopbar
            onOpenSidebar={() => setSidebarOpen(true)}
            pageTitle={pageTitle}
          />

          <Routes>
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="profile"          element={<ManagerProfile />} />
            <Route path="/"                element={<Navigate to="/account-manager/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ManagerLayout;
