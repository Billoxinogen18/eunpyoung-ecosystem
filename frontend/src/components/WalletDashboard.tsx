"use client";

import { motion } from "framer-motion";
import { useEunCoinBalance, useNanumCoinBalance } from "../hooks/useTokenBalance";
import { useStaking } from "../hooks/useStaking";
import Card from "./ui/Card";
import { Coins, TrendingUp, Heart, Activity, RefreshCw } from "lucide-react";

export default function WalletDashboard() {
  const { balance: eunBalance, isLoading: eunLoading, error: eunError, refetch: refetchEun } = useEunCoinBalance();
  const { balance: nanumBalance, isLoading: nanumLoading, error: nanumError, refetch: refetchNanum } = useNanumCoinBalance();
  const { stakedBalance, earnedRewards, apr, isTransacting } = useStaking();

  const handleRefresh = () => {
    refetchEun();
    refetchNanum();
  };

  const dashboardCards = [
    {
      title: "EunCoin Balance",
      value: eunLoading ? "Loading..." : eunError ? "Error" : `${eunBalance.toLocaleString()} EUN`,
      change: "+2.5% from last week",
      icon: Coins,
      gradient: "from-blue-500 to-cyan-500",
      isLoading: eunLoading,
      hasError: !!eunError,
    },
    {
      title: "NanumCoin Balance", 
      value: nanumLoading ? "Loading..." : nanumError ? "Error" : `${nanumBalance.toLocaleString()} NANUM`,
      change: "+15.3% from last month",
      icon: Heart,
      gradient: "from-green-500 to-emerald-500",
      isLoading: nanumLoading,
      hasError: !!nanumError,
    },
    {
      title: "Staked EUN",
      value: `${stakedBalance.toLocaleString()} EUN`,
      change: `${apr.toFixed(1)}% APR`,
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-500",
      isLoading: isTransacting,
      hasError: false,
    },
    {
      title: "Pending Rewards",
      value: `${earnedRewards.toLocaleString()} EUN`,
      change: "Available to claim",
      icon: Activity,
      gradient: "from-orange-500 to-yellow-500",
      isLoading: isTransacting,
      hasError: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
          💳 Wallet Dashboard
        </h2>
        <p className="text-gray-600 text-lg">
          Your EunCoin ecosystem portfolio overview
        </p>
        <motion.button
          onClick={handleRefresh}
          className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={eunLoading || nanumLoading}
        >
          <RefreshCw className={`w-4 h-4 ${(eunLoading || nanumLoading) ? 'animate-spin' : ''}`} />
          <span>Refresh Balances</span>
        </motion.button>
      </motion.div>

      {/* Balance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => {
          const IconComponent = card.icon;
          
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5`} />
                
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${card.gradient} bg-opacity-10`}>
                      <IconComponent 
                        className="w-6 h-6 text-gray-800"
                      />
                    </div>
                    
                    {card.isLoading && (
                      <div className="animate-pulse">
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                      </div>
                    )}
                    
                    {card.hasError && (
                      <div className="text-red-500 text-sm">⚠️</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
                    <div className="text-2xl font-bold text-gray-900">
                      {card.value}
                    </div>
                    <p className="text-sm text-gray-500">{card.change}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">⚡ Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 cursor-pointer"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-500 rounded-xl">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">Stake EUN</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Stake your EUN tokens to earn {apr.toFixed(1)}% APR and participate in DAO governance
            </p>
            <div className="text-sm font-medium text-blue-600">
              Current APR: {apr.toFixed(1)}%
            </div>
          </motion.div>

          <motion.div
            className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 cursor-pointer"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-500 rounded-xl">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">Convert to NANUM</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Convert EUN to NANUM for community donations and welfare projects
            </p>
            <div className="text-sm font-medium text-green-600">
              1:1 Conversion Rate
            </div>
          </motion.div>

          <motion.div
            className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 cursor-pointer"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-purple-500 rounded-xl">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">Earn Rewards</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Complete daily activities and community challenges to earn more EUN
            </p>
            <div className="text-sm font-medium text-purple-600">
              Up to 50 EUN daily
            </div>
          </motion.div>
        </div>
      </Card>

      {/* Network Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🌐 Network Status</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Connected to Sepolia Testnet</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>PureChain Offline Mode Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Smart Contracts Verified</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-sm text-gray-500">All systems operational</p>
          </div>
        </div>
      </Card>
    </div>
  );
}