// @ts-nocheck
/* eslint-disable */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";

export function SidebarLinks({ routes, layout = "/admin" }) {
  const { pathname } = useLocation();
  const isActive = (routePath) => pathname.includes(routePath);

  const visible = routes.filter((r) => r.layout === layout && !r.hide);

  // Collect ordered group names (preserving first-seen order)
  const groups: string[] = [];
  const ungrouped: typeof visible = [];
  visible.forEach((r) => {
    if (!r.group) { ungrouped.push(r); return; }
    if (!groups.includes(r.group)) groups.push(r.group);
  });

  const renderLink = (route, index) => {
    const active = isActive(route.path);
    return (
      <Link key={index} to={route.layout + "/" + route.path}>
        <div
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
            active
              ? "bg-navy-50 text-navy-800"
              : "text-slate-500 hover:bg-slate-50 hover:text-navy-900"
          }`}
        >
          <span
            className={`flex-shrink-0 ${
              active ? "text-gold-400" : "text-slate-400 group-hover:text-navy-500"
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
  };

  return (
    <nav className="flex flex-col gap-0.5">
      {/* Ungrouped routes (e.g. Dashboard) */}
      {ungrouped.map((route, i) => renderLink(route, `ug-${i}`))}

      {/* Grouped routes */}
      {groups.map((group) => (
        <div key={group} className="mt-4">
          {visible
            .filter((r) => r.group === group)
            .map((route, i) => renderLink(route, `${group}-${i}`))}
        </div>
      ))}
    </nav>
  );
}

export default SidebarLinks;
