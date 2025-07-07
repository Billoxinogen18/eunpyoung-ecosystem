"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { useEunCoinBalance } from "../hooks/useTokenBalance";
import toast from "react-hot-toast";

interface Store {
  id: string;
  name: string;
  category: string;
  address: string;
  discount: number;
  rating: number;
  image: string;
  acceptsOffline: boolean;
  rewardRate: number;
}

export default function StorePayment() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showQR, setShowQR] = useState(false);
  const { balance: eunBalance } = useEunCoinBalance();

  const stores: Store[] = [
    {
      id: "cafe-seoul",
      name: "Seoul Traditional Cafe",
      category: "Food & Beverage",
      address: "123 Eunpyeong-ro, Eunpyeong-gu",
      discount: 5,
      rating: 4.8,
      image: "☕",
      acceptsOffline: true,
      rewardRate: 2
    },
    {
      id: "market-fresh",
      name: "Fresh Local Market",
      category: "Groceries",
      address: "456 Market St, Eunpyeong-gu",
      discount: 10,
      rating: 4.6,
      image: "🏪",
      acceptsOffline: true,
      rewardRate: 1.5
    },
    {
      id: "pharmacy-health",
      name: "Community Health Pharmacy",
      category: "Healthcare",
      address: "789 Health Ave, Eunpyeong-gu",
      discount: 3,
      rating: 4.9,
      image: "💊",
      acceptsOffline: false,
      rewardRate: 1
    },
    {
      id: "restaurant-kimchi",
      name: "Grandma's Kimchi House",
      category: "Restaurant",
      address: "321 Food Lane, Eunpyeong-gu",
      discount: 8,
      rating: 4.7,
      image: "🥘",
      acceptsOffline: true,
      rewardRate: 3
    }
  ];

  const handlePayment = () => {
    if (!selectedStore || !paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error("Please select a store and enter a valid amount");
      return;
    }

    const eunBalanceNum = Number(eunBalance);
    const paymentAmountNum = parseFloat(paymentAmount);
    
    if (paymentAmountNum > eunBalanceNum) {
      toast.error("Insufficient EunCoin balance");
      return;
    }

    // Simulate payment processing
    setShowQR(true);
    setTimeout(() => {
      const discountAmount = (paymentAmountNum * selectedStore.discount) / 100;
      const rewardAmount = (paymentAmountNum * selectedStore.rewardRate) / 100;
      
      toast.success(`Payment successful! Saved ${discountAmount.toFixed(2)} EUN, earned ${rewardAmount.toFixed(2)} EUN rewards!`);
      setShowQR(false);
      setPaymentAmount("");
      setSelectedStore(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🏪 Store Payments</h2>
        <p className="text-gray-600">Pay with EunCoin at local businesses and earn rewards</p>
      </motion.div>

      {/* Payment Stats */}
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{Number(eunBalance).toFixed(2)}</div>
            <p className="text-sm text-gray-600">Available Balance</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">23</div>
            <p className="text-sm text-gray-600">Partner Stores</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">147</div>
            <p className="text-sm text-gray-600">Total Purchases</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">342</div>
            <p className="text-sm text-gray-600">EUN Rewards Earned</p>
          </div>
        </div>
      </Card>

      {/* Store Selection */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Select a Store</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stores.map((store) => (
            <motion.div
              key={store.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedStore?.id === store.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
              onClick={() => setSelectedStore(store)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start space-x-3">
                <div className="text-3xl">{store.image}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{store.name}</h4>
                    {store.acceptsOffline && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        Offline
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{store.category}</p>
                  <p className="text-xs text-gray-500 mb-3">{store.address}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-medium">{store.rating}</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                        {store.discount}% off
                      </span>
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                        {store.rewardRate}% rewards
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Payment Interface */}
      {selectedStore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Pay at {selectedStore.name}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Amount (EUN)
                  </label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {paymentAmount && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{paymentAmount} EUN</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount ({selectedStore.discount}%):</span>
                      <span className="font-medium text-green-600">
                        -{((parseFloat(paymentAmount) * selectedStore.discount) / 100).toFixed(2)} EUN
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rewards ({selectedStore.rewardRate}%):</span>
                      <span className="font-medium text-blue-600">
                        +{((parseFloat(paymentAmount) * selectedStore.rewardRate) / 100).toFixed(2)} EUN
                      </span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Final Amount:</span>
                      <span>
                        {(parseFloat(paymentAmount) - (parseFloat(paymentAmount) * selectedStore.discount) / 100).toFixed(2)} EUN
                      </span>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handlePayment} 
                  className="w-full"
                  disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                >
                  {selectedStore.acceptsOffline ? "Generate QR Code" : "Pay Online"}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">💳 Payment Methods</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>QR Code Payment</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>NFC Tap Payment</span>
                    </div>
                    {selectedStore.acceptsOffline && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Offline Mode Available</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">🎁 Store Benefits</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• {selectedStore.discount}% instant discount</li>
                    <li>• {selectedStore.rewardRate}% cashback in EUN</li>
                    <li>• Loyalty points accumulation</li>
                    <li>• Special member offers</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* QR Code Modal */}
      {showQR && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white p-8 rounded-xl max-w-sm w-full mx-4"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Payment QR Code
              </h3>
              
              {/* QR Code Placeholder */}
              <div className="w-48 h-48 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">📱</div>
                  <p className="text-sm text-gray-600">Scan with Store POS</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Show this QR code to the cashier or use NFC tap payment
              </p>
              
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm font-medium text-blue-900">
                  Amount: {paymentAmount} EUN
                </p>
                <p className="text-xs text-blue-700">
                  Processing payment...
                </p>
              </div>
              
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}