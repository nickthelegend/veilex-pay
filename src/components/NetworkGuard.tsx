"use client";

import { useWallet } from "@/lib/solana/wallet/context";

export default function NetworkGuard({ children }: { children: React.ReactNode }) {
  const { status } = useWallet();
  const isConnected = status === "connected";

  // On Solana, network management is usually handled by the wallet adapter.
  // We can add logic here to check for devnet/mainnet if needed.

  return <>{children}</>;
}
