"use client";

import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import contracts from "../contracts.json";
import ERC20_ABI from "../abis/ERC20.json";

export function useTokenBalance(tokenSymbol: "EUN" | "NANUM") {
  const { address } = useAccount();
  
  const contractAddress = tokenSymbol === "EUN" ? contracts.EunCoin : contracts.NanumCoin;
  
  const { data: balanceData, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

  const { data: decimalsData } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "decimals",
    query: {
      enabled: true,
    },
  });

  const { data: nameData } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "name",
    query: {
      enabled: true,
    },
  });

  const { data: symbolData } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "symbol",
    query: {
      enabled: true,
    },
  });

  // Format balance with proper decimals
  const balance = balanceData && decimalsData 
    ? formatUnits(balanceData as bigint, decimalsData as number)
    : "0";

  return {
    balance: parseFloat(balance),
    formattedBalance: balance,
    isLoading,
    error,
    refetch,
    contractAddress,
    decimals: decimalsData as number,
    name: nameData as string,
    symbol: symbolData as string,
  };
}

export function useEunCoinBalance() {
  return useTokenBalance("EUN");
}

export function useNanumCoinBalance() {
  return useTokenBalance("NANUM");
}