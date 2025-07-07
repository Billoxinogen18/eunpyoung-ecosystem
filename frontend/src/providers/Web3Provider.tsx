"use client";

import { ReactNode } from "react";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";

interface Props {
  children: ReactNode;
}

// Configure Sepolia with free RPC endpoints
const sepoliaWithRPC = {
  ...sepolia,
  rpcUrls: {
    default: {
      http: [
        'https://eth-sepolia.g.alchemy.com/v2/demo',
        'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        'https://rpc.sepolia.org'
      ]
    },
    public: {
      http: [
        'https://eth-sepolia.g.alchemy.com/v2/demo',
        'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        'https://rpc.sepolia.org'
      ]
    }
  }
};

const chains = [sepoliaWithRPC] as const;

const wagmiConfig = getDefaultConfig({
  appName: "EunCoin Ecosystem",
  projectId: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6", // Valid format but placeholder
  chains,
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/demo'),
  },
});

const queryClient = new QueryClient();

export default function Web3Provider({ children }: Props) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 