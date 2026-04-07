import React, { ReactNode } from "react";

type ButtonVariant = "primary" | "gold" | "ghost-navy" | "ghost-gold" | "navy-gold" | "dark-navy";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  text?: string;
  variant?: ButtonVariant;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  hoverBgColor?: string;
  hoverTextColor?: string;
  hoverBorderColor?: string;
  className?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  "primary":    "bg-navy-600 text-white border-navy-600 hover:bg-navy-700 hover:border-navy-700",
  "gold":       "bg-gold-500 text-navy-900 border-gold-500 hover:bg-gold-600 hover:border-gold-600",
  "ghost-navy": "bg-transparent text-navy-600 border-navy-600 hover:bg-navy-50 hover:text-navy-700 hover:border-navy-700",
  "ghost-gold": "bg-transparent text-gold-600 border-gold-500 hover:bg-gold-50 hover:text-gold-700 hover:border-gold-600",
  "navy-gold":  "bg-navy-800 text-gold-400 border-navy-800 hover:bg-navy-700 hover:text-gold-300 hover:border-navy-700",
  "dark-navy":  "bg-navy-900 text-white border-navy-900 hover:bg-navy-800 hover:border-navy-800",
};

const Button: React.FC<ButtonProps> = ({
  type = "button",
  onClick,
  disabled,
  icon,
  text,
  variant,
  bgColor = "bg-white",
  textColor = "text-navy-600",
  borderColor = "border-navy-600",
  hoverBgColor = "",
  hoverTextColor = "hover:text-navy-700",
  hoverBorderColor = "hover:border-navy-700",
  className,
}) => {
  const variantStyle = variant ? variantClasses[variant] : null;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyle ?? `${bgColor} ${textColor} ${borderColor} ${hoverBgColor} ${hoverTextColor} ${hoverBorderColor}`}
        ${className || ""}`}
    >
      {icon && <span className="flex items-center ">{icon}</span>}
      {text}
    </button>
  );
};

export default Button;
