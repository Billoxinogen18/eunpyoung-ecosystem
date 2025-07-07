"use client";

import { useAccount } from "wagmi";
import { useEunCoinBalance, useNanumCoinBalance } from "../hooks/useTokenBalance";
import Card from "./ui/Card";
import { motion } from "framer-motion";

export default function WalletDashboard() {
  const { address, isConnected } = useAccount();
  const { balance: eunBalance, isLoading: eunLoading } = useEunCoinBalance();
  const { balance: nanumBalance, isLoading: nanumLoading } = useNanumCoinBalance();

  if (!isConnected) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wallet Dashboard</h2>
        <p className="text-sm text-gray-600 font-mono">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EunCoin Balance */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">EunCoin</h3>
              <p className="text-sm text-gray-600">Main Utility Token</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                {eunLoading ? "..." : parseFloat(eunBalance).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">EUN</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Life • Payment • Reward
          </div>
        </Card>

        {/* NanumCoin Balance */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">NanumCoin</h3>
              <p className="text-sm text-gray-600">Donation Token</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                {nanumLoading ? "..." : parseFloat(nanumBalance).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">NANUM</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Donation • Sponsorship
          </div>
        </Card>
      </div>
    </motion.div>
  );
}