import React from "react";
import noDataImg from "assets/img/empty/Hand drawn no data.png";

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
    <div
      className={`flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl border border-dashed border-navy-100 bg-navy-50/30 ${className}`}
    >
        
        {/* <img
            src={noDataImg}
            alt="No data"
            className="w-[160px] h-[160px] object-contain drop-shadow-xl"
        /> */}
    
      {icon && (
        <div className="mb-4 text-gold-400 text-5xl flex items-center justify-center">
          {icon}
        </div>
      )}

      <h3 className="text-base font-bold text-navy-700 mb-1">{title}</h3>

      <p className="text-sm text-navy-300 max-w-xs leading-relaxed">
        {description}
      </p>

      {actionButton && <div className="mt-6">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
