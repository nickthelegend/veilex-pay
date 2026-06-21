"use client";

// dUSDC (Demo USD Coin) — faucet mint, balance, and approval for private sends.
import { useAccount, usePublicClient, useReadContract, useWriteContract } from "wagmi";
import { formatUnits, type Hash } from "viem";
import { toast } from "sonner";
import { DUSDC_ABI } from "@/lib/abi";
import { PAYMENT_TOKEN, CONTRACTS, isPaymentTokenConfigured } from "@/lib/contracts";
import { hskTxUrl, shortHex } from "@/lib/evm";

const DECIMALS = 6;

export function useDusdc() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const configured = isPaymentTokenConfigured();

  const { data: rawBalance, refetch } = useReadContract({
    address: PAYMENT_TOKEN,
    abi: DUSDC_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: configured && !!address, refetchInterval: 15_000 },
  });

  const balance = rawBalance != null ? Number(formatUnits(rawBalance as bigint, DECIMALS)) : 0;

  async function toastTx(label: string, run: () => Promise<Hash>) {
    const id = toast.loading(`${label}…`, { description: "Confirm in your wallet" });
    try {
      const hash = await run();
      await publicClient?.waitForTransactionReceipt({ hash });
      toast.success(`${label} confirmed`, {
        id,
        description: `tx ${shortHex(hash)}`,
        action: { label: "View ↗", onClick: () => window.open(hskTxUrl(hash), "_blank", "noopener,noreferrer") },
      });
      await refetch();
      return hash;
    } catch (e) {
      toast.error(`${label} failed`, { id, description: (e instanceof Error ? e.message : String(e)).slice(0, 140) });
      throw e;
    }
  }

  /** Mint yourself 1,000 dUSDC from the faucet. */
  async function faucet() {
    if (!configured) {
      toast.error("dUSDC not configured", { description: "Set NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS after deploying dUSDC." });
      return;
    }
    return toastTx("Mint 1,000 dUSDC", () =>
      writeContractAsync({ address: PAYMENT_TOKEN, abi: DUSDC_ABI, functionName: "faucet" }),
    );
  }

  /** Ensure the StealthRegistry can pull `amountWei` of dUSDC for a private transfer. */
  async function approveIfNeeded(amountWei: bigint) {
    if (!address) throw new Error("connect wallet");
    const current = (await publicClient!.readContract({
      address: PAYMENT_TOKEN,
      abi: DUSDC_ABI,
      functionName: "allowance",
      args: [address, CONTRACTS.StealthRegistry],
    })) as bigint;
    if (current >= amountWei) return;
    await toastTx("Approve dUSDC", () =>
      writeContractAsync({
        address: PAYMENT_TOKEN,
        abi: DUSDC_ABI,
        functionName: "approve",
        args: [CONTRACTS.StealthRegistry, amountWei],
      }),
    );
  }

  return { balance, faucet, approveIfNeeded, refetch, configured };
}
