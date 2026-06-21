// Client-side persistence of a user's stealth identity (spending + viewing keys).
// Keys NEVER leave the browser. The viewing key may be shared with an auditor
// off-chain for compliance (it can see incoming payments but cannot spend).
import type { StealthKeys } from "@/lib/stealth";

const keyFor = (owner: string) => `veilpay:stealth-keys:${owner.toLowerCase()}`;

export function loadStealthKeys(owner: string | undefined): StealthKeys | null {
  if (!owner || typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(keyFor(owner));
    return raw ? (JSON.parse(raw) as StealthKeys) : null;
  } catch {
    return null;
  }
}

export function saveStealthKeys(owner: string, keys: StealthKeys): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(keyFor(owner), JSON.stringify(keys));
}

export function clearStealthKeys(owner: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(keyFor(owner));
}

// Per-wallet scan checkpoint so re-scans only cover new blocks.
const checkpointKey = (owner: string) => `veilpay:scan-checkpoint:${owner.toLowerCase()}`;

export function loadCheckpoint(owner: string | undefined): bigint | null {
  if (!owner || typeof window === "undefined") return null;
  const raw = localStorage.getItem(checkpointKey(owner));
  return raw ? BigInt(raw) : null;
}

export function saveCheckpoint(owner: string, block: bigint): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(checkpointKey(owner), block.toString());
}
