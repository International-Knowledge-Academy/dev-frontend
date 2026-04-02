import { MdMenu } from "react-icons/md";
import useAuth from "hooks/auth/useAuth";

interface TopbarProps {
  onOpenSidebar: () => void;
  pageTitle: string;
}

const ManagerTopbar = ({ onOpenSidebar, pageTitle }: TopbarProps) => {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm rounded-2xl mb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="xl:hidden text-gray-500 hover:text-navy-700 transition"
        >
          <MdMenu size={24} />
        </button>
        <h1 className="text-xl font-bold text-navy-700">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 hidden sm:block">{user?.email}</span>
        <div className="h-9 w-9 rounded-full bg-navy-700 flex items-center justify-center text-white font-bold text-sm">
          {user?.name?.charAt(0) ?? "M"}
        </div>
      </div>
    </header>
  );
};

export default ManagerTopbar;
