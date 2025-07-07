"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, TrendingUp, Heart, Activity, Store, Users, Sparkles } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, gradient: "from-blue-500 to-cyan-500", lightColor: "text-blue-50" },
  { id: "staking", label: "Staking & DAO", icon: TrendingUp, gradient: "from-purple-500 to-pink-500", lightColor: "text-purple-50" },
  { id: "donations", label: "Donations", icon: Heart, gradient: "from-green-500 to-emerald-500", lightColor: "text-green-50" },
  { id: "activities", label: "Activities", icon: Activity, gradient: "from-orange-500 to-yellow-500", lightColor: "text-orange-50" },
  { id: "store", label: "Store Pay", icon: Store, gradient: "from-indigo-500 to-blue-500", lightColor: "text-indigo-50" },
  { id: "campaigns", label: "Campaigns", icon: Users, gradient: "from-pink-500 to-rose-500", lightColor: "text-pink-50" },
  { id: "certificates", label: "Certificates", icon: Sparkles, gradient: "from-teal-500 to-green-500", lightColor: "text-teal-50" },
];

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  return (
    <motion.nav
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-gray-200 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg"
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                E
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1 text-yellow-400"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={12} />
              </motion.div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                EunCoin
              </h1>
              <p className="text-xs text-gray-400 font-medium">Ecosystem</p>
            </div>
          </motion.div>

          {/* Navigation Tabs - Updated color scheme */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 group w-32 text-center`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Active Background */}
                  {isActive && (
                    <>
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl blur-sm opacity-75`}
                        layoutId="activeBackground"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl`}
                        layoutId="activeBackgroundSolid"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    </>
                  )}
                  {/* Hover Effect - fade in/out */}
                  {!isActive && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl opacity-0`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.9 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                  {/* Content */}
                  <div className={`relative flex items-center space-x-2 ${
                    isActive ? item.lightColor : 'text-black group-hover:text-white'
                  } transition-colors duration-200`}>
                    <IconComponent size={18} className={isActive ? item.lightColor : 'text-black group-hover:text-white'} />
                    <span className="text-sm font-bold">{item.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Users size={20} />
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation - Updated color scheme */}
      <motion.div
        className="md:hidden bg-white/90 backdrop-blur-xl border-t border-gray-200"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-3">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative p-4 rounded-2xl font-medium transition-all duration-300 group w-full`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Active Background */}
                  {isActive && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl`}
                      layoutId="mobileActiveBackground"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {/* Hover Effect for mobile - fade in/out */}
                  {!isActive && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl opacity-0`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.9 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                  {/* Content */}
                  <div className={`relative flex flex-col items-center space-y-1 ${
                    isActive ? item.lightColor : 'text-black group-hover:text-white'
                  } transition-colors duration-200`}>
                    <IconComponent size={20} className={isActive ? item.lightColor : 'text-black group-hover:text-white'} />
                    <span className="text-xs font-bold">{item.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}