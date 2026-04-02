import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ManagerSidebar from "components/manager/Sidebar";
import ManagerTopbar from "components/manager/Topbar";
import ManagerDashboard from "views/manager/dashboard";
import ManagerProfile from "views/manager/profile";

const pageTitles: Record<string, string> = {
  "/manager/dashboard": "Dashboard",
  "/manager/profile": "My Profile",
};

const ManagerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const pageTitle = pageTitles[pathname] ?? "Manager";

  return (
    <div className="flex h-full min-h-screen bg-gray-50">
      <ManagerSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content — offset by sidebar width on xl */}
      <div className="flex-1 xl:ml-[250px]">
        <div className="min-h-screen p-4 md:p-6">
          <ManagerTopbar
            onOpenSidebar={() => setSidebarOpen(true)}
            pageTitle={pageTitle}
          />

          <Routes>
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="profile"   element={<ManagerProfile />} />
            <Route path="/"         element={<Navigate to="/manager/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ManagerLayout;
