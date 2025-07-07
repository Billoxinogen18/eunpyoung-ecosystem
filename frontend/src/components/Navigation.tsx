"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "staking", label: "Staking & DAO", icon: "🗳️" },
  { id: "donations", label: "Donations", icon: "💚" },
  { id: "activities", label: "Activities", icon: "🚶" },
  { id: "store", label: "Store Pay", icon: "🏪" },
  { id: "campaigns", label: "Campaigns", icon: "🎉" },
];

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
              E
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EunCoin Ecosystem</h1>
              <p className="text-xs text-gray-500">PureChain Powered</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Connect Wallet */}
          <div className="flex items-center space-x-4">
            <ConnectButton />
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-2"
            >
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                      activeTab === item.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}