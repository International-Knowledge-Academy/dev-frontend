import React from "react";

type DividerProps = {
  className?: string;
};

const Divider: React.FC<DividerProps> = ({ className = "" }) => {
  return <div className={`h-[1px] bg-slate-100 my-6 ${className}`} />;
};

export default Divider;
