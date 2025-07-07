"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { motion } from "framer-motion";
import Card from "./ui/Card";
import Button from "./ui/Button";
import contracts from "../contracts.json";
import toast from "react-hot-toast";
import { useEunCoinBalance, useNanumCoinBalance } from "../hooks/useTokenBalance";

const DONATION_ABI = [
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "convert",
    outputs: [],
    stateMutability: "nonpayable",
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

export default function DonationInterface() {
  const { } = useAccount();
  const [convertAmount, setConvertAmount] = useState("");
  const { balance: eunBalance } = useEunCoinBalance();
  const { balance: nanumBalance } = useNanumCoinBalance();
  const { writeContract, isPending } = useWriteContract();

  const handleConvert = async () => {
    if (!convertAmount || parseFloat(convertAmount) <= 0) {
      toast.error("Please enter a valid conversion amount");
      return;
    }

    const eunBalanceNum = Number(eunBalance);
    const convertAmountNum = parseFloat(convertAmount);
    
    if (convertAmountNum > eunBalanceNum) {
      toast.error("Insufficient EunCoin balance");
      return;
    }

    try {
      // First approve the donation converter
      await writeContract({
        address: contracts.EunCoin as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [contracts.DonationConverter as `0x${string}`, parseEther(convertAmount)],
      });

      // Then convert
      await writeContract({
        address: contracts.DonationConverter as `0x${string}`,
        abi: DONATION_ABI,
        functionName: "convert",
        args: [parseEther(convertAmount)],
      });

      toast.success("Conversion successful! NanumCoins received.");
      setConvertAmount("");
    } catch (error) {
      toast.error("Conversion failed");
      console.error(error);
    }
  };

  const donationProjects = [
    {
      id: 1,
      title: "Youth Education Support",
      description: "Supporting educational programs for underprivileged youth in Eunpyeong-gu",
      target: 100000,
      raised: 67500,
      category: "Education",
      urgent: true
    },
    {
      id: 2,
      title: "Elderly Care Center",
      description: "Improving facilities and services for elderly care in the community",
      target: 75000,
      raised: 32100,
      category: "Healthcare",
      urgent: false
    },
    {
      id: 3,
      title: "Environmental Cleanup",
      description: "Community-wide environmental restoration and park improvement project",
      target: 50000,
      raised: 41200,
      category: "Environment",
      urgent: false
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">💚 Donation & Community Support</h2>
        <p className="text-gray-600">Convert EunCoin to NanumCoin and support local causes</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Interface */}
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">EunCoin → NanumCoin Conversion</h3>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-5 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-600">Your EunCoin Balance</span>
                <span className="font-semibold text-blue-600">{Number(eunBalance).toFixed(2)} EUN</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Your NanumCoin Balance</span>
                <span className="font-semibold text-green-600">{Number(nanumBalance).toFixed(2)} NANUM</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Amount to Convert (1:1 ratio)
              </label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  placeholder="Amount in EUN"
                  max={eunBalance}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Button onClick={handleConvert} loading={isPending} variant="primary">
                  Convert
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                You will receive {convertAmount || "0"} NANUM tokens
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-xl shadow-sm">
              <p className="text-sm text-yellow-800">
                💡 <strong>How it works:</strong> EunCoins are converted 1:1 to NanumCoins. 
                The EunCoins are held in the donation pool for community funding.
              </p>
            </div>
          </div>
        </Card>

        {/* Donation Tracking */}
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">🔍 Transparent Tracking</h3>
          <div className="space-y-5">
            <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
              <h4 className="font-medium text-gray-900 mb-3">Recent Donations</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Youth Education</span>
                  <span className="font-medium">+2,500 NANUM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Environmental</span>
                  <span className="font-medium">+1,800 NANUM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Elderly Care</span>
                  <span className="font-medium">+3,200 NANUM</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-5 rounded-xl shadow-sm">
              <h4 className="font-medium text-gray-900 mb-3">Total Community Impact</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Donations</span>
                  <span className="font-semibold text-green-600">140,800 NANUM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="font-semibold">8 projects</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Beneficiaries</span>
                  <span className="font-semibold">2,340 people</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Donation Projects */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">🎯 Active Donation Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {donationProjects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow bg-white/50">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-gray-900">{project.title}</h4>
                {project.urgent && (
                  <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-medium">Urgent</span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{project.description}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{((project.raised / project.target) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(project.raised / project.target) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{project.raised.toLocaleString()} NANUM</span>
                  <span>{project.target.toLocaleString()} NANUM</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">{project.category}</span>
                <Button size="sm" disabled={Number(nanumBalance) === 0}>
                  {Number(nanumBalance) === 0 ? "Get NANUM" : "Donate"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}