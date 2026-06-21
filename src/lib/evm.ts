"use client";

import { defineChain } from "viem";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

// ─── HashKey Chain ────────────────────────────────────────────────
export const hashkeyTestnet = defineChain({
  id: 133,
  name: "HashKey Chain Testnet",
  nativeCurrency: { name: "HSK", symbol: "HSK", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet.hsk.xyz"], webSocket: ["wss://testnet.hsk.xyz/ws"] },
    public: { http: ["https://testnet.hsk.xyz"] },
  },
  blockExplorers: { default: { name: "HSK Explorer", url: "https://testnet-explorer.hsk.xyz" } },
  testnet: true,
});

export const hashkeyMainnet = defineChain({
  id: 177,
  name: "HashKey Chain",
  nativeCurrency: { name: "HSK", symbol: "HSK", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.hsk.xyz"], webSocket: ["wss://mainnet.hsk.xyz/ws"] },
    public: { http: ["https://mainnet.hsk.xyz"] },
  },
  blockExplorers: { default: { name: "Blockscout", url: "https://hashkey.blockscout.com" } },
});

export const ACTIVE_CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 133);
export const activeChain = ACTIVE_CHAIN_ID === 177 ? hashkeyMainnet : hashkeyTestnet;

// ─── wagmi / RainbowKit config ────────────────────────────────────
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || "veilpay_walletconnect_dev";

export const wagmiConfig = getDefaultConfig({
  appName: "VeilPay",
  appDescription: "True private payments on HashKey Chain — stealth addresses, view-key compliance.",
  projectId,
  chains: ACTIVE_CHAIN_ID === 177 ? [hashkeyMainnet, hashkeyTestnet] : [hashkeyTestnet, hashkeyMainnet],
  ssr: true,
});

// ─── Explorer helpers ─────────────────────────────────────────────
export const explorerBaseUrl =
  process.env.NEXT_PUBLIC_EXPLORER_URL ||
  activeChain.blockExplorers?.default.url ||
  "https://testnet-explorer.hsk.xyz";

export const hskTxUrl = (hash: string) => `${explorerBaseUrl}/tx/${hash}`;
export const hskAddressUrl = (address: string) => `${explorerBaseUrl}/address/${address}`;
export const shortHex = (h: string) => (h ? `${h.slice(0, 10)}…${h.slice(-6)}` : "");
