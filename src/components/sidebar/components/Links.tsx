// @ts-nocheck
/* eslint-disable */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";

export function SidebarLinks({ routes }) {
  const { pathname } = useLocation();
  const isActive = (routePath) => pathname.includes(routePath);

  return (
    <nav className="flex flex-col gap-0.5">
      {routes.map((route, index) => {
        if (route.layout !== "/admin") return null;
        const active = isActive(route.path);

        return (
          <Link key={index} to={route.layout + "/" + route.path}>
            <div
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                active
                  ? "text-gray-500 bg-gray-50 text-navy-800"
                  : "text-gray-500 hover:bg-gray-100 hover:text-navy-900"
              }`}
            >
              <span
                className={`flex-shrink-0 ${
                  active ? "text-gold-400" : "text-gray-400 group-hover:text-navy-500"
                }`}
              >
                {route.icon ?? <DashIcon />}
              </span>
              <span className="truncate">{route.name}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-navy-800 flex-shrink-0" />
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

export default SidebarLinks;