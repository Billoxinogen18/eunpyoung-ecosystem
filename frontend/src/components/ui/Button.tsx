"use client";

import { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "onDrag"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = "", 
    variant = "primary", 
    size = "md", 
    loading = false, 
    disabled, 
    children, 
    ...props 
  }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500",
      outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500",
      ghost: "text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-500"
    };
    
    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-6 text-lg"
    };

    return (
      <motion.button
        ref={ref}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;