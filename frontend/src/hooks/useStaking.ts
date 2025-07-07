import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { useState } from "react";
import contracts from "../contracts.json";
import ERC20_ABI from "../abis/ERC20.json";
import STAKING_ABI from "../abis/EunStaking.json";
import toast from "react-hot-toast";

export function useStaking() {
  const { address } = useAccount();
  const [isTransacting, setIsTransacting] = useState(false);
  
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  // Read staked balance
  const { data: stakedBalanceData, refetch: refetchStakedBalance } = useReadContract({
    address: contracts.EunStaking as `0x${string}`,
    abi: STAKING_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  });

  // Read earned rewards
  const { data: earnedRewardsData, refetch: refetchEarned } = useReadContract({
    address: contracts.EunStaking as `0x${string}`,
    abi: STAKING_ABI,
    functionName: "earned",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  });

  // Read total staked supply
  const { data: totalSupplyData } = useReadContract({
    address: contracts.EunStaking as `0x${string}`,
    abi: STAKING_ABI,
    functionName: "totalSupply",
    query: {
      refetchInterval: 10000,
    },
  });

  // Read reward rate
  const { data: rewardRateData } = useReadContract({
    address: contracts.EunStaking as `0x${string}`,
    abi: STAKING_ABI,
    functionName: "rewardRate",
    query: {
      refetchInterval: 30000,
    },
  });

  // Read EUN token allowance for staking contract
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: contracts.EunCoin as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, contracts.EunStaking] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  });

  // Format values
  const stakedBalance = stakedBalanceData ? formatUnits(stakedBalanceData as bigint, 18) : "0";
  const earnedRewards = earnedRewardsData ? formatUnits(earnedRewardsData as bigint, 18) : "0";
  const totalStaked = totalSupplyData ? formatUnits(totalSupplyData as bigint, 18) : "0";
  const allowance = allowanceData ? formatUnits(allowanceData as bigint, 18) : "0";

  // Calculate APR (approximate, assuming 1 EUN = 1 reward token)
  const apr = totalSupplyData && rewardRateData && (totalSupplyData as bigint) > BigInt(0)
    ? (Number(formatUnits(rewardRateData as bigint, 18)) * 365 * 24 * 3600 * 100) / Number(formatUnits(totalSupplyData as bigint, 18))
    : 10; // Default 10% APR as fallback

  const stake = async (amount: string) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setIsTransacting(true);
      const amountWei = parseUnits(amount, 18);

      // Check if approval is needed
      if (allowanceData && (allowanceData as bigint) < amountWei) {
        toast("Approving token spending...", { icon: "ℹ️" });
        
        // First approve
        await writeContract({
          address: contracts.EunCoin as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [contracts.EunStaking, amountWei],
        });

        // Wait a bit and refetch allowance
        setTimeout(() => {
          refetchAllowance();
        }, 2000);
        
        toast.success("Approval successful! Now staking...");
      }

      // Then stake
      await writeContract({
        address: contracts.EunStaking as `0x${string}`,
        abi: STAKING_ABI,
        functionName: "stake",
        args: [amountWei],
      });

      toast.success("Staking transaction submitted!");
      
      // Refetch balances after a delay
      setTimeout(() => {
        refetchStakedBalance();
        refetchEarned();
      }, 3000);
      
    } catch (error) {
      console.error("Staking error:", error);
      toast.error("Staking failed. Please try again.");
    } finally {
      setIsTransacting(false);
    }
  };

  const withdraw = async (amount: string) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setIsTransacting(true);
      const amountWei = parseUnits(amount, 18);

      await writeContract({
        address: contracts.EunStaking as `0x${string}`,
        abi: STAKING_ABI,
        functionName: "withdraw",
        args: [amountWei],
      });

      toast.success("Withdrawal transaction submitted!");
      
      // Refetch balances after a delay
      setTimeout(() => {
        refetchStakedBalance();
        refetchEarned();
      }, 3000);
      
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("Withdrawal failed. Please try again.");
    } finally {
      setIsTransacting(false);
    }
  };

  const claimRewards = async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setIsTransacting(true);

      await writeContract({
        address: contracts.EunStaking as `0x${string}`,
        abi: STAKING_ABI,
        functionName: "getReward",
        args: [],
      });

      toast.success("Claim rewards transaction submitted!");
      
      // Refetch balances after a delay
      setTimeout(() => {
        refetchEarned();
      }, 3000);
      
    } catch (error) {
      console.error("Claim rewards error:", error);
      toast.error("Claiming rewards failed. Please try again.");
    } finally {
      setIsTransacting(false);
    }
  };

  return {
    stakedBalance: parseFloat(stakedBalance),
    earnedRewards: parseFloat(earnedRewards),
    totalStaked: parseFloat(totalStaked),
    apr,
    allowance: parseFloat(allowance),
    stake,
    withdraw,
    claimRewards,
    isTransacting: isTransacting || isPending || isConfirming,
    refetchStakedBalance,
    refetchEarned,
  };
}