// @ts-nocheck
/* eslint-disable */

import { HiX } from "react-icons/hi";
import { MdLogout } from "react-icons/md";
import Links from "./components/Links";
import useAuth from "hooks/auth/useAuth";
import routes from "routes";

const roleLayout: Record<string, string> = {
  admin:           "/admin",
  account_manager: "/account-manager",
};

const roleLabel: Record<string, string> = {
  admin:           "Admin",
  account_manager: "Account Manager",
};

const rolePanel: Record<string, string> = {
  admin:           "Admin Panel",
  account_manager: "Account Manager Panel",
};

const Sidebar = ({ open, onClose }) => {
  const { logout, user } = useAuth();
  const layout = roleLayout[user?.role] ?? "/admin";
  const label  = roleLabel[user?.role]  ?? "";
  const panel  = rolePanel[user?.role]  ?? "Panel";

  return (
    <>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-navy-900/40 backdrop-blur-sm xl:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col bg-white border-r border-gray-100 shadow-lg transition-transform duration-300 xl:z-0 xl:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        <button
          className="absolute right-3 top-3 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition xl:hidden"
          onClick={onClose}
        >
          <HiX size={18} />
        </button>

        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <img
            src="/brand/IKA Logo-01.png"
            alt="IKA"
            className="h-9 w-9 rounded-lg object-cover"
          />
          <div>
            <p className="text-sm font-bold text-navy-800 leading-tight">IKA</p>
            <p className="text-[10px] text-gray-400 leading-tight">{panel}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 mx-3 mt-4 rounded-xl bg-navy-50 border border-navy-100">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-navy-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-navy-800 truncate leading-tight">
              {user?.name ?? "Loading..."}
            </p>
            <p className="text-[10px] font-bold tracking-widest uppercase text-gold-500 leading-tight mt-0.5">
              {label}
            </p>
          </div>
        </div>

        <p className="px-6 mt-5 mb-1.5 text-[10px] font-bold tracking-widest uppercase text-gray-400">
          Main Menu
        </p>

        <div className="flex-1 overflow-y-auto px-3">
          <Links routes={routes} layout={layout} />
        </div>

        <div className="border-t border-gray-100 px-3 py-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            type="button"
          >
            <MdLogout size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
