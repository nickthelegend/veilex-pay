"use client";

// EVM balance hook (HashKey Chain) — kept at this path for backward-compat.
// Returns the same shape the app already consumes: { lamports, balance, ... }
// where `lamports` is the raw wei (bigint) and `balance` is HSK as a number.
import { useBalance as useWagmiBalance } from "wagmi";

export function useBalance(address?: string) {
  const { data, isLoading, error, refetch } = useWagmiBalance({
    address: address as `0x${string}` | undefined,
    query: { enabled: !!address, refetchInterval: 60_000 },
  });

  const lamports = (data?.value ?? null) as bigint | null;
  const balance = data ? Number(data.formatted) : null;

  return {
    lamports,
    balance,
    isLoading,
    error,
    mutate: refetch,
    refetch,
  };
}
