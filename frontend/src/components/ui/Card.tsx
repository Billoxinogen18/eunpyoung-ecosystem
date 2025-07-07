"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export default function Card({ children, className = "", hover = true, gradient = false }: CardProps) {
  const baseClasses = gradient
    ? "backdrop-blur-xl bg-gradient-to-br from-white/30 to-white/10 border border-white/20 rounded-xl shadow-lg"
    : "backdrop-blur-xl bg-white/20 border border-white/20 rounded-xl shadow-lg";

  return (
    <motion.div
      className={`${baseClasses} ${className} transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { 
        scale: 1.02, 
        y: -5,
        boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.2)"
      } : {}}
    >
      <div className="relative overflow-hidden rounded-xl">
        {/* Animated gradient overlay for extra sparkle */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-green-400/10 opacity-0 transition-opacity duration-300 hover:opacity-100" />
        
        {/* Content with improved padding */}
        <div className="relative z-10 p-6 md:p-8">
          {children}
        </div>
      </div>
    </motion.div>
  );
}