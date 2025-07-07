"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { Sparkles, Coins, Heart, Activity, Store, Users, Shield, Zap, Globe, TrendingUp } from "lucide-react";

import Navigation from "../components/Navigation";
import WalletDashboard from "../components/WalletDashboard";
import StakingInterface from "../components/StakingInterface";
import DonationInterface from "../components/DonationInterface";
import ActivityRewards from "../components/ActivityRewards";
import StorePayment from "../components/StorePayment";
import Campaigns from "../components/Campaigns";
import Card from "../components/ui/Card";
import CertificateGallery from "../components/CertificateGallery";

export default function Home() {
  const { isConnected, address, status } = useAccount();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Enhanced debug logging
  useEffect(() => {
    console.log("🔍 Connection Debug:", { 
      isConnected, 
      address, 
      status,
      hasAddress: !!address,
      addressLength: address?.length 
    });
  }, [isConnected, address, status]);

  const renderContent = () => {
    if (!isConnected) {
      return (
        <div className="min-h-screen relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-green-900">
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            
            {/* Floating Orbs */}
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute top-40 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
              animate={{
                x: [0, -80, 0],
                y: [0, 60, 0],
                scale: [1, 0.8, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 5
              }}
            />
            <motion.div
              className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-500/20 rounded-full blur-3xl"
              animate={{
                x: [0, 120, 0],
                y: [0, -80, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 10
              }}
            />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center max-w-6xl mx-auto"
            >
              {/* Logo Section */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mb-12"
              >
                <div className="relative inline-block">
                  <motion.div
                    className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 rounded-3xl flex items-center justify-center text-white text-6xl font-black mb-8 shadow-2xl"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    E
                  </motion.div>
                  <motion.div
                    className="absolute -top-2 -right-2 text-yellow-400"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles size={24} />
                  </motion.div>
                </div>
                
                <motion.h1
                  className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.4 }}
                >
                  EunCoin
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="space-y-2 mb-8"
                >
                  <p className="text-2xl text-blue-100 font-semibold">
                    Powered by PureChain & Purewallet
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-lg text-purple-200">
                    <Shield size={20} />
                    <span>Offline Blockchain-based Regional Model</span>
                    <Globe size={20} />
                  </div>
                </motion.div>
              </motion.div>

              {/* Features Grid */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="mb-12"
              >
                <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-12 rounded-3xl shadow-2xl">
                  <h2 className="text-4xl font-bold text-white mb-8">Welcome to the Future of Regional Community</h2>
                  
                  {/* Debug info - styled beautifully */}
                  <motion.div 
                    className="bg-black/20 backdrop-blur-md border border-white/20 p-4 rounded-xl mb-8 text-sm text-blue-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap size={16} className="text-yellow-400" />
                      <strong className="text-white">System Status</strong>
                    </div>
                    <div className="space-y-1">
                      <p>Status: <span className="text-green-400">{status}</span></p>
                      <p>Connected: <span className="text-green-400">{isConnected ? 'Yes' : 'No'}</span></p>
                      <p>Address: <span className="text-blue-300">{address ? `${address.slice(0,6)}...` : 'None'}</span></p>
                    </div>
                  </motion.div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* EunCoin Features */}
                    <motion.div
                      className="backdrop-blur-md bg-blue-500/20 border border-blue-300/30 p-8 rounded-2xl"
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <Coins className="text-blue-400" size={32} />
                        <h3 className="text-2xl font-bold text-blue-300">EunCoin Features</h3>
                      </div>
                      <ul className="space-y-3 text-blue-100">
                        <motion.li whileHover={{ x: 5 }} className="flex items-center space-x-2">
                          <Activity size={16} className="text-green-400" />
                          <span>Activity rewards for community participation</span>
                        </motion.li>
                        <motion.li whileHover={{ x: 5 }} className="flex items-center space-x-2">
                          <Store size={16} className="text-purple-400" />
                          <span>QR & offline NFC payment support</span>
                        </motion.li>
                        <motion.li whileHover={{ x: 5 }} className="flex items-center space-x-2">
                          <TrendingUp size={16} className="text-yellow-400" />
                          <span>Staking for DAO voting rights</span>
                        </motion.li>
                        <motion.li whileHover={{ x: 5 }} className="flex items-center space-x-2">
                          <Sparkles size={16} className="text-pink-400" />
                          <span>Local store discounts & cashback</span>
                        </motion.li>
                      </ul>
                    </motion.div>

                    {/* NanumCoin Features */}
                    <motion.div
                      className="backdrop-blur-md bg-green-500/20 border border-green-300/30 p-8 rounded-2xl"
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <Heart className="text-green-400" size={32} />
                        <h3 className="text-2xl font-bold text-green-300">NanumCoin Features</h3>
                      </div>
                      <ul className="space-y-3 text-green-100">
                        <motion.li whileHover={{ x: 5 }} className="flex items-center space-x-2">
                          <Shield size={16} className="text-blue-400" />
                          <span>Transparent donation tracking</span>
                        </motion.li>
                        <motion.li whileHover={{ x: 5 }} className="flex items-center space-x-2">
                          <Users size={16} className="text-purple-400" />
                          <span>Community welfare support</span>
                        </motion.li>
                        <motion.li whileHover={{ x: 5 }} className="flex items-center space-x-2">
                          <Globe size={16} className="text-yellow-400" />
                          <span>Educational & public service funding</span>
                        </motion.li>
                        <motion.li whileHover={{ x: 5 }} className="flex items-center space-x-2">
                          <TrendingUp size={16} className="text-pink-400" />
                          <span>DAO-based donation decisions</span>
                        </motion.li>
                      </ul>
                    </motion.div>
                  </div>

                  {/* PureTech Core Features */}
                  <motion.div
                    className="backdrop-blur-md bg-purple-500/20 border border-purple-300/30 p-8 rounded-2xl mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <h3 className="text-2xl font-bold text-purple-300 mb-6 flex items-center space-x-3">
                      <Zap className="text-yellow-400" size={28} />
                      <span>PureTech Core Features</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <motion.div 
                        className="flex items-center space-x-3 p-4 rounded-xl bg-white/10"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white font-medium">ISO Certified Blockchain</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center space-x-3 p-4 rounded-xl bg-white/10"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="text-white font-medium">Offline Payment Capability</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center space-x-3 p-4 rounded-xl bg-white/10"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                        <span className="text-white font-medium">Cold Wallet Integration</span>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Connect Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-75"></div>
                    <div className="relative">
                      <ConnectButton />
                    </div>
                  </motion.div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return <WalletDashboard />;
      case "staking":
        return <StakingInterface />;
      case "donations":
        return <DonationInterface />;
      case "activities":
        return <ActivityRewards />;
      case "store":
        return <StorePayment />;
      case "campaigns":
        return <Campaigns />;
      case "certificates":
        return <CertificateGallery />;
      default:
        return <WalletDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      
      {/* Enhanced Navigation and Debug */}
      <AnimatePresence>
        {(isConnected || address) && (
          <>
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
            <motion.div 
              className="bg-gradient-to-r from-green-400 to-blue-500 p-3 text-xs text-center border-b shadow-lg text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="font-semibold">Wallet Connected</span>
                </div>
                <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                <span>Status: {status}</span>
                <span>Connected: {isConnected ? 'TRUE' : 'FALSE'}</span>
                <span>Tab: {activeTab}</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <main className={`${(isConnected || address) ? 'pt-4' : ''}`}>
        <div className={`${(isConnected || address) ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}`}>
          <AnimatePresence>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
