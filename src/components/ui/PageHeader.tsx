// @ts-nocheck
import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  bordered?: boolean;
  className?: string;
}

const PageHeader = ({ title, subtitle, actions, bordered = false, className = "" }: PageHeaderProps) => (
  <div
    className={`flex items-start justify-between gap-4 px-4 sm:px-6 py-4 ${
      bordered ? "border-b border-slate-100" : ""
    } ${className}`}
  >
    <div className="min-w-0">
      <h1 className="text-base font-bold text-navy-800 truncate">{title}</h1>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
  </div>
);

export default PageHeader;
