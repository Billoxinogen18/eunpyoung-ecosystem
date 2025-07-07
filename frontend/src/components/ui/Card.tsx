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
    ? "backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/5 border border-white/20 rounded-3xl shadow-2xl"
    : "backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl";

  return (
    <motion.div
      className={`${baseClasses} ${className} transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { 
        scale: 1.02, 
        y: -5,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      } : {}}
    >
      <div className="relative overflow-hidden rounded-3xl">
        {/* Animated gradient overlay for extra sparkle */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-green-400/5 opacity-0 transition-opacity duration-300 hover:opacity-100" />
        
        {/* Content with improved padding */}
        <div className="relative z-10 p-6 md:p-8">
          {children}
        </div>
      </div>
    </motion.div>
  );
}