/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";

import routes from "routes.js";

const Sidebar = ({ open, onClose }) => {
  
  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className="mx-[56px] mt-[50px] flex items-center gap-3">
        {/* Actor avatar */}
        <div className="relative flex-shrink-0">
          <img
            src="/brand/IKA Logo-01.png"
            alt="Mohammed Ahmed"
            className="w-11 h-11 rounded-full object-cover border-2 border-gold-400 shadow-sm"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-navy-800" />
        </div>
        {/* Name & role */}
        <div className="min-w-0">
          <p className="text-sm font-bold text-navy-700 dark:text-white truncate">
            Mohammed Ahmed
          </p>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-gold-500">
            Admin
          </p>
        </div>
      </div>
      
      <div className="mt-[30px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <Links routes={routes} />
      </ul>

      {/* Nav item end */}
    </div>
  );
};

export default Sidebar;
