"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

import Navigation from "../components/Navigation";
import WalletDashboard from "../components/WalletDashboard";
import StakingInterface from "../components/StakingInterface";
import DonationInterface from "../components/DonationInterface";
import ActivityRewards from "../components/ActivityRewards";
import StorePayment from "../components/StorePayment";
import Campaigns from "../components/Campaigns";
import Card from "../components/ui/Card";

export default function Home() {
  const { isConnected, address } = useAccount();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Debug logging
  useEffect(() => {
    console.log("Wallet connection status:", { isConnected, address });
  }, [isConnected, address]);

  const renderContent = () => {
    if (!isConnected) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50"
        >
          <div className="text-center max-w-2xl mx-auto px-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-6">
                E
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                EunCoin Ecosystem
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Powered by PureChain & Purewallet
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Offline Blockchain-based Regional Model
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-6"
            >
              <Card className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Welcome to the Future of Regional Community</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">🪙 EunCoin Features</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Activity rewards for community participation</li>
                      <li>• QR & offline NFC payment support</li>
                      <li>• Staking for DAO voting rights</li>
                      <li>• Local store discounts & cashback</li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-green-600 mb-2">💚 NanumCoin Features</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Transparent donation tracking</li>
                      <li>• Community welfare support</li>
                      <li>• Educational & public service funding</li>
                      <li>• DAO-based donation decisions</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">🔧 PureTech Core Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>ISO Certified Blockchain</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Offline Payment Capability</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Cold Wallet Integration</span>
                    </div>
                  </div>
                </div>
                <ConnectButton />
              </Card>
            </motion.div>
          </div>
        </motion.div>
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
            background: '#363636',
            color: '#fff',
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
      
      {/* Always show navigation when connected */}
      {isConnected && (
        <>
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          {/* Debug info */}
          <div className="bg-green-100 p-2 text-xs text-center">
            🟢 Wallet Connected: {address?.slice(0, 6)}...{address?.slice(-4)} | Active Tab: {activeTab}
          </div>
        </>
      )}
      
      <main className={`${isConnected ? 'pt-4' : ''}`}>
        <div className={`${isConnected ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}`}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
