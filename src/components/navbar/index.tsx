// @ts-nocheck
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlignJustify } from "react-icons/fi";
import { MdLogout, MdKeyboardArrowDown, MdPerson, MdLock } from "react-icons/md";
import Dropdown from "components/dropdown";
import useAuth from "hooks/auth/useAuth";
import ChangePasswordModal from "components/ui/modals/ChangePasswordModal";

const Navbar = (props) => {
  const { onOpenSidenav, brandText } = props;
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <>
      <nav className="sticky z-40 flex flex-wrap items-center justify-between rounded-md bg-brand-50/10 p-2 backdrop-blur-xl transition-all duration-300 top-4">

        <div className="flex items-center gap-4">
          <button
            className="xl:hidden flex items-center justify-center w-9 h-9 rounded-lg text-navy-500 hover:bg-navy-50 hover:text-navy-800 transition"
            onClick={onOpenSidenav}
          >
            <FiAlignJustify size={20} />
          </button>

          <div>
            <p className="text-xs text-gray-400 leading-none mb-0.5">
              Pages / <span className="capitalize">{brandText}</span>
            </p>
            <h1 className="text-lg font-bold capitalize sm:text-2xl lg:text-3xl text-navy-800 leading-none">
              {brandText}
            </h1>
          </div>
        </div>

        <Dropdown
          button={
            <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-navy-50 transition-all group">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-navy-500 border-1 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-navy-800 leading-tight">
                  {user?.name ?? "..."}
                </p>
                <p className="text-[10px] font-bold tracking-widest uppercase text-gold-500 leading-tight">
                  {user?.role ?? ""}
                </p>
              </div>
              <MdKeyboardArrowDown
                size={16}
                className="hidden md:block text-gray-400 group-hover:text-navy-600 transition"
              />
            </button>
          }
          children={
            <div className="w-56 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 bg-navy-50">
                <div className="w-9 h-9 rounded-xl bg-navy-800 border-2 border-gold-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {user?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-navy-800 truncate">
                    {user?.name ?? "..."}
                  </p>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gold-500">
                    {user?.role ?? ""}
                  </p>
                </div>
              </div>
              <div className="h-px bg-gray-100" />

              <div className="p-2 flex flex-col gap-0.5">
                <button
                  onClick={() => navigate("/admin/profile")}
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
                <div className="h-px bg-gray-100 my-1" />
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
          classNames={"py-2 top-12 -left-[180px] w-max"}
        />
      </nav>

      <ChangePasswordModal
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </>
  );
};

export default Navbar;
