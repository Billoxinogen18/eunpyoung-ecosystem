"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useEunCoinBalance } from "../hooks/useTokenBalance";
import { useStaking } from "../hooks/useStaking";
import { useDAO } from "../hooks/useDAO";
import Card from "./ui/Card";
import Button from "./ui/Button";
import toast from "react-hot-toast";
import { TrendingUp, Users, Vote, Award, Lock, Unlock } from "lucide-react";

interface Proposal {
  id: number;
  title: string;
  description: string;
  votes: number;
  deadline: string;
  status: "active" | "passed" | "failed";
  myVote?: "for" | "against" | null;
}

export default function StakingInterface() {
  const { balance: eunBalance } = useEunCoinBalance();
  const { 
    stakedBalance, 
    earnedRewards, 
    apr, 
    totalStaked,
    stake, 
    withdraw, 
    claimRewards, 
    isTransacting 
  } = useStaking();
  const { proposals, castVote, isLoading: daoLoading } = useDAO();
  
  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"stake" | "dao">("stake");
  const [myVotes, setMyVotes] = useState<Record<string, "for" | "against">>({});

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (parseFloat(stakeAmount) > eunBalance) {
      toast.error("Insufficient EUN balance");
      return;
    }

    await stake(stakeAmount);
    setStakeAmount("");
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (parseFloat(withdrawAmount) > stakedBalance) {
      toast.error("Insufficient staked balance");
      return;
    }

    await withdraw(withdrawAmount);
    setWithdrawAmount("");
  };

  const handleClaimRewards = async () => {
    if (earnedRewards <= 0) {
      toast.error("No rewards to claim");
      return;
    }

    await claimRewards();
  };

  const votingPower = stakedBalance > 0 ? (stakedBalance / totalStaked) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
          🗳️ Staking & DAO
        </h2>
        <p className="text-gray-600 text-lg">
          Stake EUN tokens to earn rewards and participate in governance
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab("stake")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === "stake"
                ? "bg-white text-purple-600 shadow-lg"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Lock className="w-4 h-4 inline mr-2" />
            Staking
          </button>
          <button
            onClick={() => setActiveTab("dao")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === "dao"
                ? "bg-white text-purple-600 shadow-lg"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Vote className="w-4 h-4 inline mr-2" />
            DAO Governance
          </button>
        </div>
      </div>

      {activeTab === "stake" && (
        <>
          {/* Staking Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-5" />
              <div className="relative p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-2xl">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Staked Balance</h3>
                    <p className="text-sm text-gray-600">Your staked EUN</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stakedBalance.toLocaleString()} EUN
                </div>
                <p className="text-sm text-purple-600 font-medium">
                  Earning {apr.toFixed(1)}% APR
                </p>
              </div>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-5" />
              <div className="relative p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-2xl">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Earned Rewards</h3>
                    <p className="text-sm text-gray-600">Available to claim</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {earnedRewards.toLocaleString()} EUN
                </div>
                <Button
                  size="sm"
                  variant="success"
                  onClick={handleClaimRewards}
                  disabled={earnedRewards <= 0 || isTransacting}
                  loading={isTransacting}
                >
                  Claim Rewards
                </Button>
              </div>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-5" />
              <div className="relative p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-2xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Total Staked</h3>
                    <p className="text-sm text-gray-600">Network total</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {totalStaked.toLocaleString()} EUN
                </div>
                <p className="text-sm text-blue-600 font-medium">
                  Your share: {votingPower.toFixed(2)}%
                </p>
              </div>
            </Card>
          </div>

          {/* Staking Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stake EUN */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Lock className="w-6 h-6 mr-3 text-purple-600" />
                Stake EUN
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to Stake
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <div className="absolute right-3 top-3 text-sm text-gray-500">
                      EUN
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span className="text-gray-600">
                      Available: {eunBalance.toLocaleString()} EUN
                    </span>
                    <button
                      onClick={() => setStakeAmount(eunBalance.toString())}
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Max
                    </button>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Staking Benefits:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Earn {apr.toFixed(1)}% APR on staked tokens</li>
                    <li>• Participate in DAO governance voting</li>
                    <li>• Support network security and decentralization</li>
                    <li>• Unlock exclusive community features</li>
                  </ul>
                </div>

                <Button
                  onClick={handleStake}
                  disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || isTransacting}
                  loading={isTransacting}
                  variant="gradient"
                  className="w-full"
                >
                  Stake EUN
                </Button>
              </div>
            </Card>

            {/* Withdraw EUN */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Unlock className="w-6 h-6 mr-3 text-orange-600" />
                Withdraw Staked EUN
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to Withdraw
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <div className="absolute right-3 top-3 text-sm text-gray-500">
                      EUN
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span className="text-gray-600">
                      Staked: {stakedBalance.toLocaleString()} EUN
                    </span>
                    <button
                      onClick={() => setWithdrawAmount(stakedBalance.toString())}
                      className="text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Max
                    </button>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">⚠️ Withdrawal Notice:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Withdrawing reduces your voting power</li>
                    <li>• You&apos;ll stop earning rewards on withdrawn amount</li>
                    <li>• Consider claiming rewards before withdrawing</li>
                  </ul>
                </div>

                <Button
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || isTransacting}
                  loading={isTransacting}
                  variant="warning"
                  className="w-full"
                >
                  Withdraw EUN
                </Button>
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === "dao" && (
        <>
          {/* DAO Overview */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">DAO Governance</h3>
                <p className="text-gray-600">Participate in community decision making</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {votingPower.toFixed(2)}%
                </div>
                <p className="text-sm text-gray-500">Your Voting Power</p>
              </div>
            </div>

            {stakedBalance <= 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="text-yellow-600">⚠️</div>
                  <div>
                    <h4 className="font-semibold text-yellow-800">Stake Required for Voting</h4>
                    <p className="text-sm text-yellow-700">
                      You need to stake EUN tokens to participate in DAO governance and voting.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Active Proposals */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Active Proposals</h3>
            
            {daoLoading && <p className="text-gray-500">Loading proposals...</p>}
            {proposals.map((proposal) => {
              const myVote = myVotes[proposal.id.toString()];
              return (
                <Card key={proposal.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 break-all">
                          {proposal.description.slice(0,60)}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          proposal.status === "Active" 
                            ? "bg-green-100 text-green-700"
                            : proposal.status === "Succeeded"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {proposal.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 break-all">{proposal.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span>ID: {proposal.id.toString()}</span>
                        {myVote && (
                          <span className="text-green-600 font-medium">✓ Voted {myVote}</span>
                        )}
                      </div>
                    </div>
                    
                    {proposal.status === "Active" && !myVote && stakedBalance > 0 && (
                      <div className="flex space-x-2 ml-4">
                        <Button size="sm" variant="success" onClick={async ()=>{
                          await castVote(proposal.id,1);
                          setMyVotes({ ...myVotes, [proposal.id.toString()]: "for" });
                        }}>
                          Vote For
                        </Button>
                        <Button size="sm" variant="danger" onClick={async ()=>{
                          await castVote(proposal.id,0);
                          setMyVotes({ ...myVotes, [proposal.id.toString()]: "against" });
                        }}>
                          Vote Against
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}