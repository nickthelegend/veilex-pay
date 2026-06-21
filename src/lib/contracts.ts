// Solana Network Configuration
export const CONTRACTS = {
  network: "solanaDevnet",
  cluster: "devnet",
  rpc: "https://api.devnet.solana.com",
  // Mock Program IDs for Solana
  StealthRegistry: "ObolusRegistry11111111111111111111111111111",
  StealthAnnouncer: "ObolusAnnouncer111111111111111111111111111",
  DarkBookEngine: "ObolusEngine111111111111111111111111111111",
  Vault: "ObolusVault11111111111111111111111111111111",
} as const;

export const SOLANA_DEVNET = {
  id: "devnet",
  name: "Solana Devnet",
  rpcUrl: CONTRACTS.rpc,
  nativeCurrency: { name: "Solana", symbol: "SOL", decimals: 9 },
  blockExplorer: "https://explorer.solana.com/?cluster=devnet",
} as const;
