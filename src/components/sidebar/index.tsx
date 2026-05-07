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
  admin:           "Administrator",
  account_manager: "Account Manager",
};

const Sidebar = ({ open, onClose }) => {
  const { logout, user } = useAuth();
  const layout = roleLayout[user?.role] ?? "/admin";

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col bg-white transition-transform duration-300 xl:z-0 xl:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile close */}
        <button
          className="absolute right-3 top-3 p-1.5 rounded-lg text-navy-400 hover:bg-navy-700 hover:text-white transition xl:hidden"
          onClick={onClose}
        >
          <HiX size={18} />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-3 px-5 pt-6 pb-5">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-white/10 flex items-center justify-center">
            <img
              src="/brand/IKA Logo-01.png"
              alt="IKA"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-navy-800 leading-none tracking-wide">IKA</p>
            <p className="text-[10px] text-slate-400 mt-1 leading-none">Knowledge Academy</p>
          </div>
        </div>

        <div className="mx-4 h-px bg-slate-100" />

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          <Links routes={routes} layout={layout} />
        </div>

        <div className="mx-4 h-px bg-slate-100" />

        {/* User + logout */}
        <div className="px-3 py-4 space-y-1">
          {/* User card */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50">
            <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-navy-800 truncate leading-snug">
                {user?.name ?? "User"}
              </p>
              <p className="text-[10px] text-slate-400 capitalize mt-0.5">
                {roleLabel[user?.role] ?? user?.role}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            type="button"
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-navy-800 transition-colors"
          >
            <MdLogout size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
