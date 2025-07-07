"use client";

import { useAccount, useReadContract } from "wagmi";
import { formatEther } from "viem";
import contracts from "../contracts.json";

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
] as const;

export function useTokenBalance(tokenAddress: string) {
  const { address } = useAccount();

  const { data: balance, isLoading, error } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const formattedBalance = balance ? formatEther(balance as bigint) : "0";

  return {
    balance: formattedBalance,
    isLoading,
    error,
  };
}

export function useEunCoinBalance() {
  return useTokenBalance(contracts.EunCoin);
}

export function useNanumCoinBalance() {
  return useTokenBalance(contracts.NanumCoin);
}