"use client";

// EVM wallet context for HashKey Chain, exposing the SAME shape the app already
// consumes ({ status, wallet:{account:{address}}, connect, disconnect, ... }) so
// no call sites needed changing. Backed by wagmi + RainbowKit.
import { type PropsWithChildren } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

// The real provider tree (Wagmi + RainbowKit) lives in src/app/providers.tsx.
// This stays as a passthrough so existing imports keep resolving.
export function WalletProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export function useWallet() {
  const { address, isConnected, isConnecting, isReconnecting, connector } = useAccount();
  const { connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  const status = isConnected
    ? "connected"
    : isConnecting || isReconnecting
      ? "connecting"
      : "disconnected";

  const wallet = address
    ? {
        account: { address, label: connector?.name },
        connector: { id: connector?.id ?? "", name: connector?.name ?? "" },
      }
    : undefined;

  return {
    connectors: connectors.map((c) => ({ id: c.id, name: c.name, icon: (c as { icon?: string }).icon })),
    status,
    wallet,
    signer: undefined,
    error: undefined,
    connect: async (_connectorId?: string) => {
      openConnectModal?.();
    },
    disconnect: async () => {
      await disconnectAsync();
    },
    isReady: true,
  };
}
