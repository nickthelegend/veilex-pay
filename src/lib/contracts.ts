// HashKey Chain configuration for VeilPay private payments.
//
// The StealthRegistry below is the same contract built in ../veilex-contracts.
// After deploying it, set NEXT_PUBLIC_STEALTH_REGISTRY_ADDRESS in .env.local.
import { activeChain, ACTIVE_CHAIN_ID, explorerBaseUrl } from "@/lib/evm";

const ZERO = "0x0000000000000000000000000000000000000000" as const;

export const CONTRACTS = {
  chainId: ACTIVE_CHAIN_ID,
  network: activeChain.name,
  rpc: activeChain.rpcUrls.default.http[0],
  explorer: explorerBaseUrl,
  // StealthRegistry (ERC-5564) — fill after deploying veilex-contracts.
  StealthRegistry: (process.env.NEXT_PUBLIC_STEALTH_REGISTRY_ADDRESS || ZERO) as `0x${string}`,
} as const;

/** Scheme id used by StealthRegistry (1 = secp256k1). */
export const SCHEME_ID = 1n;

/** ERC-20 token to use for private token transfers (optional; native HSK by default). */
export const PAYMENT_TOKEN = (process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS || ZERO) as `0x${string}`;

export const isRegistryConfigured = () => CONTRACTS.StealthRegistry !== ZERO;
export const isPaymentTokenConfigured = () => PAYMENT_TOKEN !== ZERO;
