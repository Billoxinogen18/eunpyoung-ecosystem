"use client";

import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export default function Card({ children, className = "", animate = true }: CardProps) {
  const cardContent = (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
}