"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "gradient";
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  loading?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  icon,
  loading = false,
}: ButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25",
    secondary: "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg shadow-gray-500/25",
    success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/25",
    warning: "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg shadow-yellow-500/25",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25",
    gradient: "bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white shadow-lg shadow-purple-500/25",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
        relative overflow-hidden rounded-2xl font-semibold
        transition-all duration-300 ease-out
        transform-gpu
        focus:outline-none focus:ring-4 focus:ring-opacity-50
        disabled:transform-none disabled:hover:scale-100
      `}
      whileHover={!disabled ? { 
        scale: 1.05,
        y: -2,
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      
      {/* Button content */}
      <div className="relative flex items-center justify-center space-x-2">
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        {icon && !loading && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            {icon}
          </motion.div>
        )}
        <span className="relative z-10">{children}</span>
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl blur-lg opacity-30 bg-gradient-to-r from-current to-current -z-10" />
    </motion.button>
  );
}