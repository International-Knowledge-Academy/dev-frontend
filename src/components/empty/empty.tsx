import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionButton?: React.ReactNode;
  className?: string;
}

const EmptyState = ({
  icon,
  title = "No data yet",
  description = "Data will appear here once it's available.",
  actionButton,
  className = "",
}: EmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 ${className}`}>

      {/* Icon bubble */}
      {icon && (
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-2xl bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-300 text-3xl shadow-sm">
            {icon}
          </div>
          {/* Decorative dots */}
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-gold-200 border-2 border-white" />
          <span className="absolute -bottom-1 -left-1.5 w-2 h-2 rounded-full bg-navy-200 border-2 border-white" />
        </div>
      )}

      <h3 className="text-sm font-bold text-navy-700 mb-1">{title}</h3>

      <p className="text-xs text-gray-400 max-w-[220px] text-center leading-relaxed">
        {description}
      </p>

      {actionButton && <div className="mt-5">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
