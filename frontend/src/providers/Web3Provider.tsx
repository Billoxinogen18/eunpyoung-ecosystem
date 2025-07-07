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
        'https://rpc.sepolia.org',
        'https://rpc2.sepolia.org',
        'https://sepolia.gateway.tenderly.co'
      ]
    },
    public: {
      http: [
        'https://rpc.sepolia.org',
        'https://rpc2.sepolia.org',
        'https://sepolia.gateway.tenderly.co'
      ]
    }
  }
};

const chains = [sepoliaWithRPC] as const;

// Use a public RPC that supports CORS
const wagmiConfig = getDefaultConfig({
  appName: "EunCoin Ecosystem",
  projectId: "12345678901234567890123456789012", // 32 char string
  chains,
  transports: {
    [sepolia.id]: http('https://rpc.sepolia.org'),
  },
  ssr: true,
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