// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdMenu, MdLogout, MdKeyboardArrowDown, MdPerson, MdLock } from "react-icons/md";
import Dropdown from "components/dropdown";
import useAuth from "hooks/auth/useAuth";
import ChangePasswordModal from "components/ui/modals/ChangePasswordModal";

interface TopbarProps {
  onOpenSidebar: () => void;
  pageTitle: string;
}

const ManagerTopbar = ({ onOpenSidebar, pageTitle }: TopbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm rounded-2xl mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSidebar}
            className="xl:hidden text-slate-500 hover:text-navy-700 transition"
          >
            <MdMenu size={24} />
          </button>
          <h1 className="text-xl font-bold text-navy-700">{pageTitle}</h1>
        </div>

        <Dropdown
          button={
            <button className="flex items-center gap-3 px-3 py-2 rounded-md lg:rounded-lg hover:bg-navy-50 transition-all group">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-navy-500 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-navy-800 leading-tight">{user?.name ?? "..."}</p>
                <p className="text-[10px] font-bold tracking-widest uppercase text-gold-500 leading-tight">{user?.role ?? ""}</p>
              </div>
              <MdKeyboardArrowDown size={16} className="hidden md:block text-slate-400 group-hover:text-navy-600 transition" />
            </button>
          }
          children={
            <div className="w-56 rounded-2xl bg-white shadow-xl border border-slate-100 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 bg-navy-50">
                <div className="w-9 h-9 rounded-xl bg-navy-800 border-2 border-gold-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {user?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-navy-800 truncate">{user?.name ?? "..."}</p>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gold-500">{user?.role ?? ""}</p>
                </div>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="p-2 flex flex-col gap-0.5">
                <button
                  onClick={() => navigate("/account-manager/profile")}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-navy-700 hover:bg-navy-50 transition text-left"
                >
                  <MdPerson size={16} />
                  My Profile
                </button>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-navy-700 hover:bg-navy-50 transition text-left"
                >
                  <MdLock size={16} />
                  Change Password
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  onClick={logout}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition text-left"
                >
                  <MdLogout size={16} />
                  Log Out
                </button>
              </div>
            </div>
          }
          classNames={"py-2 top-14 -left-[180px] w-max"}
        />
      </header>

      <ChangePasswordModal
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </>
  );
};

export default ManagerTopbar;
