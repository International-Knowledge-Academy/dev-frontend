// @ts-nocheck
/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import DashIcon from "components/icons/DashIcon";

export function SidebarLinks({ routes, layout = "/admin" }) {
  const { pathname } = useLocation();
  const isActive = (routePath: string) => pathname.includes(routePath);

  const visible = routes.filter((r) => r.layout === layout && !r.hide);

  const groups: string[] = [];
  const ungrouped: typeof visible = [];
  visible.forEach((r) => {
    if (!r.group) { ungrouped.push(r); return; }
    if (!groups.includes(r.group)) groups.push(r.group);
  });

  // Initialize accordion: auto-open if a child is active
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    visible.forEach((r) => {
      if (r.children?.length) {
        init[r.path] = r.children.some((c) => pathname.includes(c.path));
      }
    });
    return init;
  });

  // Re-open accordion on navigation (e.g. browser back)
  useEffect(() => {
    setOpenMap((prev) => {
      const next = { ...prev };
      visible.forEach((r) => {
        if (r.children?.length && r.children.some((c) => pathname.includes(c.path))) {
          next[r.path] = true;
        }
      });
      return next;
    });
  }, [pathname]);

  const toggle = (path: string) =>
    setOpenMap((prev) => ({ ...prev, [path]: !prev[path] }));

  const renderLink = (route: any, index: any) => {
    const active = isActive(route.path);

    /* ── Accordion parent ─────────────────────────────────────────────── */
    if (route.children?.length) {
      const open           = openMap[route.path] ?? false;
      const anyChildActive = route.children.some((c) => isActive(c.path));

      return (
        <div key={index}>
          <button
            type="button"
            onClick={() => toggle(route.path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
              anyChildActive
                ? "bg-navy-800 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            <span className={`flex-shrink-0 transition-colors ${
              anyChildActive ? "text-gold-400" : "text-slate-400 group-hover:text-slate-600"
            }`}>
              {route.icon ?? <DashIcon />}
            </span>
            <span className="truncate flex-1 text-left">{route.name}</span>
            <ChevronDown
              size={14}
              className={`flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""} ${
                anyChildActive ? "text-white/50" : "text-slate-300"
              }`}
            />
          </button>

          {/* Children */}
          {open && (
            <div className="ml-4 mt-0.5 pl-3 flex flex-col gap-0.5 border-l-2 border-slate-100">
              {route.children.map((child: any, ci: number) => {
                const childActive = isActive(child.path);
                return (
                  <Link key={ci} to={`${route.layout}/${child.path}`}>
                    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group ${
                      childActive
                        ? "bg-navy-50 text-navy-800"
                        : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                    }`}>
                      <span className={`flex-shrink-0 ${
                        childActive ? "text-gold-400" : "text-slate-300 group-hover:text-slate-500"
                      }`}>
                        {child.icon ?? <DashIcon />}
                      </span>
                      <span className="truncate flex-1">{child.name}</span>
                      {childActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-navy-600 flex-shrink-0" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    /* ── Regular link ─────────────────────────────────────────────────── */
    return (
      <Link key={index} to={route.layout + "/" + route.path}>
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
          active
            ? "bg-navy-800 text-white shadow-sm"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        }`}>
          <span className={`flex-shrink-0 transition-colors ${
            active ? "text-gold-400" : "text-slate-400 group-hover:text-slate-600"
          }`}>
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
