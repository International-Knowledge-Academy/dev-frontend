import { NavLink } from "react-router-dom";
import { MdDashboard, MdPerson, MdLogout } from "react-icons/md";
import useAuth from "hooks/auth/useAuth";

const links = [
  { label: "Dashboard", to: "/account-manager/dashboard", icon: <MdDashboard size={20} /> },
  { label: "Profile",   to: "/account-manager/profile",   icon: <MdPerson size={20} /> },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const ManagerSidebar = ({ open, onClose }: SidebarProps) => {
  const { logout } = useAuth();

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 xl:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[250px] flex-col bg-white shadow-xl transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} xl:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-6 border-b border-slate-100">
          <div className="h-8 w-8 rounded-lg bg-navy-700 flex items-center justify-center">
            <span className="text-white text-sm font-bold">M</span>
          </div>
          <span className="text-lg font-extrabold text-navy-700">Manager</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition
                ${isActive
                  ? "bg-navy-700 text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-navy-700"
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition"
          >
            <MdLogout size={20} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default ManagerSidebar;
