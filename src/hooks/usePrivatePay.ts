"use client";

// usePrivatePay — the real private-payments engine on HashKey Chain.
// Wraps the Veilex StealthRegistry: register a stealth meta-address, and send
// shielded payments to one-time stealth addresses (with on-chain announcement).
import { useWriteContract, usePublicClient } from "wagmi";
import { parseEther, parseUnits, isAddress, type Hash } from "viem";
import { toast } from "sonner";
import { STEALTH_REGISTRY_ABI } from "@/lib/abi";
import { CONTRACTS, SCHEME_ID, PAYMENT_TOKEN, isRegistryConfigured } from "@/lib/contracts";
import { generateStealthAddress } from "@/lib/stealth";
import { hskTxUrl, shortHex } from "@/lib/evm";

const as0x = (h: string) => (h.startsWith("0x") ? h : `0x${h}`) as `0x${string}`;

export type SendResult = { hash: Hash; stealthAddress: string };

export function usePrivatePay() {
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  async function runTx(label: string, send: () => Promise<Hash>): Promise<Hash> {
    if (!isRegistryConfigured()) {
      toast.error("StealthRegistry not configured", {
        description: "Set NEXT_PUBLIC_STEALTH_REGISTRY_ADDRESS in .env.local",
      });
      throw new Error("StealthRegistry address not configured");
    }
    const id = toast.loading(`${label}…`, { description: "Confirm in your wallet" });
    try {
      const hash = await send();
      toast.loading(`${label}…`, { id, description: `Pending · ${shortHex(hash)}` });
      const receipt = await publicClient!.waitForTransactionReceipt({ hash });
      toast.dismiss(id);
      if (receipt.status === "reverted") {
        toast.error(`${label} reverted`, { description: `tx ${shortHex(hash)}` });
        return hash;
      }
      toast.success(`${label} confirmed`, {
        description: `tx ${shortHex(hash)} — tap to view on HSK Explorer`,
        duration: 9000,
        action: { label: "View ↗", onClick: () => window.open(hskTxUrl(hash), "_blank", "noopener,noreferrer") },
      });
      return hash;
    } catch (e) {
      toast.error(`${label} failed`, {
        id,
        description: (e instanceof Error ? e.message : String(e)).slice(0, 140),
      });
      throw e;
    }
  }

  /** Read a user's on-chain stealth meta-address (0x + 132 hex, or null). */
  async function getMetaAddress(identity: `0x${string}`): Promise<string | null> {
    const meta = (await publicClient!.readContract({
      address: CONTRACTS.StealthRegistry,
      abi: STEALTH_REGISTRY_ABI,
      functionName: "getStealthMetaAddress",
      args: [identity, SCHEME_ID],
    })) as `0x${string}`;
    if (!meta || meta === "0x" || meta.replace(/^0x/, "").length < 132) return null;
    return meta;
  }

  /** Register your stealth meta-address so others can pay you privately. */
  async function register(metaAddressHex: string): Promise<Hash> {
    return runTx("Register stealth identity", () =>
      writeContractAsync({
        address: CONTRACTS.StealthRegistry,
        abi: STEALTH_REGISTRY_ABI,
        functionName: "registerStealthMetaAddress",
        args: [SCHEME_ID, as0x(metaAddressHex)],
      }),
    );
  }

  /** Resolve recipient input → 66-byte meta-address (direct paste or registry lookup). */
  async function resolveMeta(recipient: string): Promise<string> {
    const r = recipient.trim();
    const bare = r.replace(/^0x/, "");
    if (bare.length === 132) return as0x(bare); // pasted stealth meta-address
    if (isAddress(r)) {
      const meta = await getMetaAddress(r as `0x${string}`);
      if (!meta) throw new Error("Recipient has not registered a stealth meta-address");
      return meta;
    }
    throw new Error("Enter the recipient's address or their 66-byte stealth meta-address");
  }

  /** Send native HSK to a fresh stealth address derived from the recipient's meta-address. */
  async function sendNative(recipient: string, amountHsk: string): Promise<SendResult> {
    const meta = await resolveMeta(recipient);
    const { stealthAddress, ephemeralPubKey, viewTag } = generateStealthAddress(meta);
    const hash = await runTx("Private payment", () =>
      writeContractAsync({
        address: CONTRACTS.StealthRegistry,
        abi: STEALTH_REGISTRY_ABI,
        functionName: "privateTransferNative",
        args: [stealthAddress as `0x${string}`, as0x(ephemeralPubKey), as0x(viewTag)],
        value: parseEther(amountHsk),
      }),
    );
    return { hash, stealthAddress };
  }

  /** Send an ERC-20 (PAYMENT_TOKEN) privately. Requires prior token approval to the registry. */
  async function sendToken(recipient: string, amount: string, decimals = 18): Promise<SendResult> {
    const meta = await resolveMeta(recipient);
    const { stealthAddress, ephemeralPubKey, viewTag } = generateStealthAddress(meta);
    const hash = await runTx("Private token payment", () =>
      writeContractAsync({
        address: CONTRACTS.StealthRegistry,
        abi: STEALTH_REGISTRY_ABI,
        functionName: "privateTransfer",
        args: [PAYMENT_TOKEN, stealthAddress as `0x${string}`, parseUnits(amount, decimals), as0x(ephemeralPubKey), as0x(viewTag)],
      }),
    );
    return { hash, stealthAddress };
  }

  return { register, getMetaAddress, resolveMeta, sendNative, sendToken };
}
