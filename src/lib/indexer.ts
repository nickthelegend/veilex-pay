// Mock Indexer - No-op for Solana Migration
export async function indexAnnouncementsFromBlock() {
  return { indexed: 0, latestBlock: 0 };
}

export async function indexDarkPoolEvents() {
  return { indexed: 0 };
}
