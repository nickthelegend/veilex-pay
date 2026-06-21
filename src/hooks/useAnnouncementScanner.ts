"use client";

// Real stealth-payment scanner for HashKey Chain. Reads StealthRegistry
// `Announcement` logs and uses the viewer's VIEWING PRIVATE KEY (never leaves
// the browser) to detect which one-time stealth addresses belong to them.
import { useState, useCallback } from "react";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { checkAnnouncement } from "@/lib/stealth";
import { CONTRACTS, isRegistryConfigured } from "@/lib/contracts";
import { loadStealthKeys } from "@/lib/stealth-store";

const ANNOUNCEMENT_EVENT = parseAbiItem(
  "event Announcement(uint256 indexed schemeId, address indexed stealthAddress, address indexed caller, bytes ephemeralPubKey, bytes metadata)",
);

const NATIVE_SENTINEL = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export type MatchedPayment = {
  stealthAddress: string;
  ephemeralPubKey: string;
  stealthPrivKey: string;
  token: string;
  isNative: boolean;
  amountWei: bigint;
  txHash: string;
  blockNumber: bigint;
};

// metadata = viewTag(1) ‖ selector(4) ‖ token(20) ‖ amount(32)  → 57 bytes
function parseMetadata(metadata: string): { token: string; isNative: boolean; amountWei: bigint } {
  const hex = metadata.replace(/^0x/, "");
  if (hex.length < 114) return { token: NATIVE_SENTINEL, isNative: true, amountWei: 0n };
  const token = "0x" + hex.slice(10, 50);
  const amountWei = BigInt("0x" + hex.slice(50, 114));
  const isNative = token.toLowerCase() === NATIVE_SENTINEL;
  return { token, isNative, amountWei };
}

const CHUNK = 9_000n;
const DEFAULT_LOOKBACK = 500_000n;

export function useAnnouncementScanner(owner?: string) {
  const publicClient = usePublicClient();
  const [isScanning, setIsScanning] = useState(false);
  const [matches, setMatches] = useState<MatchedPayment[]>([]);
  const [scanned, setScanned] = useState(0);
  const [lastScannedBlock, setLastScannedBlock] = useState<bigint>(0n);
  const [error, setError] = useState<string | null>(null);

  const scan = useCallback(
    async (viewingPrivKeyOverride?: string) => {
      setError(null);
      if (!publicClient) return;
      if (!isRegistryConfigured()) {
        setError("StealthRegistry not configured (set NEXT_PUBLIC_STEALTH_REGISTRY_ADDRESS).");
        return;
      }
      const keys = loadStealthKeys(owner);
      const viewingPrivKey = (viewingPrivKeyOverride || keys?.viewingPrivKey || "").replace(/^0x/, "");
      if (!viewingPrivKey) {
        setError("No viewing key found. Create your stealth identity on the Account page first.");
        return;
      }

      setIsScanning(true);
      try {
        const latest = await publicClient.getBlockNumber();
        const envStart = process.env.NEXT_PUBLIC_START_BLOCK ? BigInt(process.env.NEXT_PUBLIC_START_BLOCK) : null;
        let from = envStart ?? (latest > DEFAULT_LOOKBACK ? latest - DEFAULT_LOOKBACK : 0n);

        const found: MatchedPayment[] = [];
        let total = 0;
        while (from <= latest) {
          const to = from + CHUNK > latest ? latest : from + CHUNK;
          const logs = await publicClient.getLogs({
            address: CONTRACTS.StealthRegistry,
            event: ANNOUNCEMENT_EVENT,
            fromBlock: from,
            toBlock: to,
          });
          total += logs.length;
          for (const log of logs) {
            const eph = String(log.args.ephemeralPubKey ?? "").replace(/^0x/, "");
            const stealth = String(log.args.stealthAddress ?? "");
            if (!eph || !stealth) continue;
            const res = checkAnnouncement(eph, viewingPrivKey, stealth);
            if (res.matched && res.stealthPrivKey) {
              found.push({
                stealthAddress: stealth,
                ephemeralPubKey: "0x" + eph,
                stealthPrivKey: res.stealthPrivKey,
                txHash: log.transactionHash ?? "",
                blockNumber: log.blockNumber ?? 0n,
                ...parseMetadata(String(log.args.metadata ?? "0x")),
              });
            }
          }
          from = to + 1n;
        }

        setMatches(found);
        setScanned(total);
        setLastScannedBlock(latest);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setIsScanning(false);
      }
    },
    [publicClient, owner],
  );

  return { scan, isScanning, matches, scanned, lastScannedBlock, error };
}
