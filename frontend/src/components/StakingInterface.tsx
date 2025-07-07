"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { parseEther, formatEther } from "viem";
import { motion } from "framer-motion";
import Card from "./ui/Card";
import Button from "./ui/Button";
import contracts from "../contracts.json";
import toast from "react-hot-toast";

const STAKING_ABI = [
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "stakes",
    outputs: [
      { name: "amount", type: "uint256" },
      { name: "timestamp", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "pendingReward",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const ERC20_ABI = [
  {
    inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export default function StakingInterface() {
  const { address } = useAccount();
  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const { writeContract, isPending } = useWriteContract();

  // Read staking data
  const { data: stakeData } = useReadContract({
    address: contracts.EunStaking as `0x${string}`,
    abi: STAKING_ABI,
    functionName: "stakes",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: pendingReward } = useReadContract({
    address: contracts.EunStaking as `0x${string}`,
    abi: STAKING_ABI,
    functionName: "pendingReward",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const stakedAmount = stakeData ? formatEther(stakeData[0] as bigint) : "0";
  const reward = pendingReward ? formatEther(pendingReward as bigint) : "0";

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error("Please enter a valid stake amount");
      return;
    }

    try {
      // First approve the staking contract
      await writeContract({
        address: contracts.EunCoin as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [contracts.EunStaking as `0x${string}`, parseEther(stakeAmount)],
      });

      // Then stake
      await writeContract({
        address: contracts.EunStaking as `0x${string}`,
        abi: STAKING_ABI,
        functionName: "stake",
        args: [parseEther(stakeAmount)],
      });

      toast.success("Staking successful!");
      setStakeAmount("");
    } catch (error) {
      toast.error("Staking failed");
      console.error(error);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid withdrawal amount");
      return;
    }

    try {
      await writeContract({
        address: contracts.EunStaking as `0x${string}`,
        abi: STAKING_ABI,
        functionName: "withdraw",
        args: [parseEther(withdrawAmount)],
      });

      toast.success("Withdrawal successful!");
      setWithdrawAmount("");
    } catch (error) {
      toast.error("Withdrawal failed");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Staking & DAO Governance</h2>
        <p className="text-gray-600">Stake EunCoin to earn rewards and gain voting rights</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staking Stats */}
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Staking</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-600">Staked Amount</span>
              <span className="font-semibold text-blue-600">{parseFloat(stakedAmount).toFixed(2)} EUN</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-600">Pending Rewards</span>
              <span className="font-semibold text-green-600">{parseFloat(reward).toFixed(4)} EUN</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-600">APR</span>
              <span className="font-semibold text-purple-600">10%</span>
            </div>
          </div>
        </Card>

        {/* Staking Actions */}
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Staking Actions</h3>
          <div className="space-y-4">
            {/* Stake */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stake EunCoin
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="Amount to stake"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={handleStake} loading={isPending}>
                  Stake
                </Button>
              </div>
            </div>

            {/* Withdraw */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Withdraw Staked EunCoin
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Amount to withdraw"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={handleWithdraw} variant="outline" loading={isPending}>
                  Withdraw
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* DAO Voting Section */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">🗳️ DAO Governance</h3>
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Active Proposals</h4>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium text-gray-900">Increase Staking APR to 15%</h5>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Proposal to increase the annual percentage rate from 10% to 15% to incentivize more staking participation.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-600">✓ 2,450 votes (73%)</span>
                  <span className="text-red-600">✗ 900 votes (27%)</span>
                </div>
                <Button size="sm" disabled={parseFloat(stakedAmount) === 0}>
                  {parseFloat(stakedAmount) === 0 ? "Stake to Vote" : "Vote"}
                </Button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium text-gray-900">Fund Community Center Renovation</h5>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Active</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Allocate 50,000 NANUM tokens for renovating the local community center in Eunpyeong-gu.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-600">✓ 1,820 votes (58%)</span>
                  <span className="text-red-600">✗ 1,320 votes (42%)</span>
                </div>
                <Button size="sm" disabled={parseFloat(stakedAmount) === 0}>
                  {parseFloat(stakedAmount) === 0 ? "Stake to Vote" : "Vote"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}