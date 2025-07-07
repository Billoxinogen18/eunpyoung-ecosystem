"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Card from "./ui/Card";
import Button from "./ui/Button";
import toast from "react-hot-toast";

interface Campaign {
  id: string;
  title: string;
  description: string;
  type: "challenge" | "event" | "donation" | "voting";
  status: "active" | "upcoming" | "completed";
  participants: number;
  maxParticipants?: number;
  reward: number;
  startDate: string;
  endDate: string;
  image: string;
  progress?: number;
  requirements: string[];
}

export default function Campaigns() {
  const [selectedTab, setSelectedTab] = useState("active");
  const [joinedCampaigns, setJoinedCampaigns] = useState<string[]>([]);

  const campaigns: Campaign[] = [
    {
      id: "offline-challenge",
      title: "#OfflineChallenge",
      description: "Scan QR codes offline and complete walking challenges to earn EunCoin rewards",
      type: "challenge",
      status: "active",
      participants: 1234,
      maxParticipants: 2000,
      reward: 100,
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      image: "🚶‍♀️",
      progress: 62,
      requirements: ["Walk 10,000 steps daily", "Visit 5 local businesses", "Complete offline payments"]
    },
    {
      id: "daily-donation",
      title: "1 Donation Per Day",
      description: "Participate in daily community donations and support local causes",
      type: "donation",
      status: "active",
      participants: 567,
      reward: 25,
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      image: "💝",
      progress: 78,
      requirements: ["Convert 10+ EUN to NANUM daily", "Support different causes weekly"]
    },
    {
      id: "good-store",
      title: "Good Store Weekly Ranking",
      description: "Top-rated stores get community recognition and special offline events",
      type: "event",
      status: "active",
      participants: 89,
      reward: 200,
      startDate: "2025-01-01",
      endDate: "2025-01-07",
      image: "🏆",
      progress: 45,
      requirements: ["Rate stores after purchases", "Write detailed reviews", "Share experiences"]
    },
    {
      id: "eunco-festival",
      title: "EunCo Festival",
      description: "Exclusive marketplace where payments work without internet connection",
      type: "event",
      status: "upcoming",
      participants: 2156,
      maxParticipants: 5000,
      reward: 500,
      startDate: "2025-02-15",
      endDate: "2025-02-17",
      image: "🎪",
      requirements: ["Register by Feb 10", "Complete offline payment setup", "Bring mobile device"]
    },
    {
      id: "donation-dao",
      title: "Donation DAO Voting",
      description: "Vote on donation sites selection using offline QR voting system",
      type: "voting",
      status: "active",
      participants: 892,
      reward: 50,
      startDate: "2025-01-05",
      endDate: "2025-01-12",
      image: "🗳️",
      progress: 89,
      requirements: ["Hold staked EUN tokens", "Review proposal documents", "Submit votes"]
    },
    {
      id: "green-transport",
      title: "Green Transport Month",
      description: "Use public transportation and eco-friendly options for community rewards",
      type: "challenge",
      status: "completed",
      participants: 1567,
      reward: 150,
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      image: "🚌",
      progress: 100,
      requirements: ["Use public transport 20+ times", "Log eco-friendly trips", "Share transport tips"]
    }
  ];

  const filteredCampaigns = campaigns.filter(campaign => {
    if (selectedTab === "all") return true;
    return campaign.status === selectedTab;
  });

  const handleJoinCampaign = (campaignId: string) => {
    if (joinedCampaigns.includes(campaignId)) {
      toast.error("Already joined this campaign!");
      return;
    }

    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      setJoinedCampaigns([...joinedCampaigns, campaignId]);
      toast.success(`Successfully joined ${campaign.title}!`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "challenge": return "🏃";
      case "event": return "📅";
      case "donation": return "💖";
      case "voting": return "🗳️";
      default: return "📋";
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🎉 Community Campaigns</h2>
        <p className="text-gray-600">Join challenges and events using PureTech offline capabilities</p>
      </motion.div>

      {/* Campaign Stats */}
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{joinedCampaigns.length}</div>
            <p className="text-sm text-gray-600">Joined Campaigns</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">1,847</div>
            <p className="text-sm text-gray-600">Total Rewards</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">23</div>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">12</div>
            <p className="text-sm text-gray-600">Active</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: "active", label: "Active" },
          { id: "upcoming", label: "Upcoming" },
          { id: "completed", label: "Completed" },
          { id: "all", label: "All" }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={selectedTab === tab.id ? "primary" : "ghost"}
            size="sm"
            onClick={() => setSelectedTab(tab.id)}
            className="flex-1"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCampaigns.map((campaign) => {
          const isJoined = joinedCampaigns.includes(campaign.id);
          
          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{campaign.image}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{campaign.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {getTypeIcon(campaign.type)} {campaign.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">+{campaign.reward}</div>
                    <p className="text-xs text-gray-500">EUN</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{campaign.description}</p>

                {/* Progress Bar (for active campaigns) */}
                {campaign.progress && campaign.status === "active" && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{campaign.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${campaign.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Participants */}
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-gray-600">
                    {campaign.participants.toLocaleString()} participants
                    {campaign.maxParticipants && ` / ${campaign.maxParticipants.toLocaleString()}`}
                  </span>
                  <span className="text-gray-500">
                    {campaign.startDate} - {campaign.endDate}
                  </span>
                </div>

                {/* Requirements */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {campaign.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-1">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleJoinCampaign(campaign.id)}
                  variant={isJoined ? "secondary" : "primary"}
                  size="sm"
                  disabled={isJoined || campaign.status === "completed"}
                  className="w-full"
                >
                  {isJoined ? "✓ Joined" : 
                   campaign.status === "completed" ? "Completed" :
                   campaign.status === "upcoming" ? "Register" : "Join Campaign"}
                </Button>

                {isJoined && campaign.status === "active" && (
                  <div className="mt-2 text-xs text-green-600 font-medium text-center">
                    🎯 Track your progress in the Activities tab
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Featured Campaign */}
      <Card>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">🎪 EunCo Festival 2025</h3>
              <p className="text-blue-100 mb-3">
                The largest offline blockchain event in Eunpyeong-gu. Make payments, donate, and vote without internet!
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">Feb 15-17</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">2,156 registered</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">500 EUN rewards</span>
              </div>
            </div>
            <div className="text-center md:text-right">
                              <Button variant="secondary" className="text-white border-white hover:bg-white hover:text-blue-600">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}