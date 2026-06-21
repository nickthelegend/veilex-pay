// EVM (HashKey Chain) amount helpers. Kept at this path for backward-compat;
// names retain the original "sol/lamports" wording but operate on 18-decimal
// HSK wei. 1 HSK = 10^18 wei.
import { formatUnits, parseUnits } from "viem";

export type Lamports = bigint;

/** HSK (float) → wei (bigint). */
export function lamportsFromSol(sol: number): Lamports {
  return parseUnits(String(sol), 18);
}

/** wei (bigint) → human HSK string, trimmed to maxDecimals. */
export function lamportsToSolString(amount: Lamports, maxDecimals = 4): string {
  const full = formatUnits(amount, 18);
  if (!full.includes(".")) return full;
  const [whole, frac] = full.split(".");
  const trimmed = frac.slice(0, maxDecimals).replace(/0+$/, "");
  return trimmed ? `${whole}.${trimmed}` : whole;
}
