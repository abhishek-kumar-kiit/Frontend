 import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "outline"; // optional style variants
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "w-full flex justify-center items-center py-2 px-4 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 focus:ring-blue-400",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300",
    danger:
      "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:opacity-90 focus:ring-red-400",
    outline:
      "border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 focus:ring-blue-400",
  };

  return (
    <button
      {...props}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
