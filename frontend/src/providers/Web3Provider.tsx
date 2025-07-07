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

// Configure Sepolia with CORS-friendly RPC endpoints
const sepoliaWithRPC = {
  ...sepolia,
  rpcUrls: {
    default: {
      http: [
        'https://eth-sepolia.public.blastapi.io',
        'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
        'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
      ]
    },
    public: {
      http: [
        'https://eth-sepolia.public.blastapi.io',
        'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
        'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
      ]
    }
  }
};

const chains = [sepoliaWithRPC] as const;

// Use a public RPC that supports CORS
const wagmiConfig = getDefaultConfig({
  appName: "EunCoin Ecosystem",
  projectId: "32c728e6ecfaf70e2c7733d6c1ecab1d", // WalletConnect project ID
  chains,
  transports: {
    [sepolia.id]: http('https://eth-sepolia.public.blastapi.io'),
  },
  ssr: true,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 30000,
    },
  },
});

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