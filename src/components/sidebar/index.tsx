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
        className={`fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col bg-white border-r border-slate-100 shadow-lg transition-transform duration-300 xl:z-0 xl:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        <button
          className="absolute right-3 top-3 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition xl:hidden"
          onClick={onClose}
        >
          <HiX size={18} />
        </button>

        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
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

        <div className="mt-5 flex-1 overflow-y-auto px-3">
          <Links routes={routes} layout={layout} />
        </div>

        <div className="border-t border-slate-100 px-3 py-3">
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
