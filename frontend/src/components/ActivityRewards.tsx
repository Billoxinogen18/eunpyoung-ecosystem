"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Card from "./ui/Card";
import Button from "./ui/Button";
import toast from "react-hot-toast";

interface Activity {
  id: string;
  name: string;
  description: string;
  reward: number;
  icon: string;
  category: string;
  completed: boolean;
  daily?: boolean;
}

export default function ActivityRewards() {
  const [completedToday, setCompletedToday] = useState<string[]>([]);

  const activities: Activity[] = [
    {
      id: "walking",
      name: "Daily Walk",
      description: "Take 8,000 steps in Eunpyeong-gu",
      reward: 10,
      icon: "🚶",
      category: "Health",
      completed: false,
      daily: true
    },
    {
      id: "transit",
      name: "Public Transport",
      description: "Use public transportation for commuting",
      reward: 5,
      icon: "🚌",
      category: "Environment",
      completed: false,
      daily: true
    },
    {
      id: "review",
      name: "Local Business Review",
      description: "Write a review for a local business",
      reward: 15,
      icon: "⭐",
      category: "Community",
      completed: false,
      daily: false
    },
    {
      id: "event",
      name: "Community Event",
      description: "Attend a local community event",
      reward: 25,
      icon: "🎪",
      category: "Social",
      completed: false,
      daily: false
    },
    {
      id: "recycle",
      name: "Recycling",
      description: "Use designated recycling stations",
      reward: 8,
      icon: "♻️",
      category: "Environment",
      completed: false,
      daily: true
    },
    {
      id: "volunteer",
      name: "Volunteer Work",
      description: "Participate in community volunteer activities",
      reward: 50,
      icon: "🤝",
      category: "Social",
      completed: false,
      daily: false
    }
  ];

  const handleCompleteActivity = (activityId: string) => {
    if (completedToday.includes(activityId)) {
      toast.error("Activity already completed today!");
      return;
    }

    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      setCompletedToday([...completedToday, activityId]);
      toast.success(`Activity completed! +${activity.reward} EUN earned!`);
    }
  };

  const categories = ["All", "Health", "Environment", "Community", "Social"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredActivities = selectedCategory === "All" 
    ? activities 
    : activities.filter(a => a.category === selectedCategory);

  const totalEarnedToday = completedToday.reduce((total, activityId) => {
    const activity = activities.find(a => a.id === activityId);
    return total + (activity?.reward || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🚶 Activity Rewards</h2>
        <p className="text-gray-600">Earn EunCoin by participating in local community activities</p>
      </motion.div>

      {/* Daily Summary */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Today&apos;s Progress</h3>
            <p className="text-gray-600">Complete activities to earn EunCoin rewards</p>
          </div>
          <div className="mt-4 md:mt-0 text-center md:text-right">
            <div className="text-3xl font-bold text-green-600">{totalEarnedToday} EUN</div>
            <p className="text-sm text-gray-500">Earned Today</p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{completedToday.length}</div>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{activities.length - completedToday.length}</div>
            <p className="text-sm text-gray-600">Remaining</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">47</div>
            <p className="text-sm text-gray-600">Streak Days</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">1,340</div>
            <p className="text-sm text-gray-600">Total EUN</p>
          </div>
        </div>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "primary" : "secondary"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => {
          const isCompleted = completedToday.includes(activity.id);
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`h-full ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{activity.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{activity.name}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {activity.category}
                      </span>
                    </div>
                  </div>
                  {activity.daily && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      Daily
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4">{activity.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-green-600">+{activity.reward}</span>
                    <span className="text-sm text-gray-500">EUN</span>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={isCompleted ? "secondary" : "primary"}
                    onClick={() => handleCompleteActivity(activity.id)}
                    disabled={isCompleted}
                  >
                    {isCompleted ? "✓ Completed" : "Complete"}
                  </Button>
                </div>

                {isCompleted && (
                  <div className="mt-3 text-xs text-green-600 font-medium">
                    ✨ Reward claimed!
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Offline Mode Notice */}
      <Card>
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">📱 Offline Mode Available</h3>
          <p className="text-gray-600 mb-4">
            With Purewallet&apos;s offline capabilities, you can complete activities and earn rewards even without internet connection. 
            Activities are synced when you reconnect to the network.
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">QR Code Scanning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">NFC Payments</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Cold Wallet Mode</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}