import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <h1 className="text-3xl font-bold">EunCoin Ecosystem</h1>
      <ConnectButton />
      {/* Additional components (balances, staking, donation) will appear once connected */}
    </main>
  );
}
