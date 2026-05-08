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
          className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
            active
              ? "bg-navy-800 text-white shadow-sm"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
        >
          <span
            className={`flex-shrink-0 transition-colors ${
              active ? "text-gold-400" : "text-slate-400 group-hover:text-slate-600"
            }`}
          >
            {route.icon ?? <DashIcon />}
          </span>
          <span className="truncate flex-1">{route.name}</span>
          {active && (
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0" />
          )}
        </div>
      </Link>
    );
  };

  return (
    <nav className="flex flex-col gap-0.5">
      {ungrouped.map((route, i) => renderLink(route, `ug-${i}`))}

      {groups.map((group) => (
        <div key={group} className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-300 px-3 mb-1.5">
            {group}
          </p>
          {visible
            .filter((r) => r.group === group)
            .map((route, i) => renderLink(route, `${group}-${i}`))}
        </div>
      ))}
    </nav>
  );
}

export default SidebarLinks;
