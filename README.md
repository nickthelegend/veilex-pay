# VeilPay 🛡️💸

> True private payments on HashKey Chain.

Send and receive money **without revealing the recipient**. VeilPay uses **ERC-5564 stealth addresses**: every payment lands at a fresh one-time address that only the recipient can detect (with their *viewing* key) and spend (with their *spending* key). Share the viewing key with an auditor for **compliance** — they can *see* your incoming payments but can never *spend* them.

## How it works
1. **Register** — generate a spending + viewing keypair in your browser and publish a public *meta-address* to the on-chain `StealthRegistry`.
2. **Send** — the sender derives a one-time stealth address from your meta-address via ECDH, sends funds there, and emits an on-chain announcement.
3. **Scan** — your inbox scans announcements with your viewing key and surfaces the payments only you can see.

Also includes a **shielded dark pool** (MongoDB-backed matcher) for private dUSDC↔HSK swaps — resting orders stay encrypted until matched.

## Verified live on HashKey Chain testnet (133)
Register → send → scan was confirmed end-to-end on-chain.
- `StealthRegistry` `0xf8b8b082aF43643C93CDB7BD4e549fb183F81522`
- `dUSDC` `0xc0068DC46B661552d4237bE17e67aFAefE0C7e03`

## Stack
Next.js 16 · wagmi + RainbowKit · viem · `@noble/curves` (secp256k1 stealth crypto) · MongoDB · Pyth

## Run
```bash
npm install
cp .env.example .env.local   # MONGODB_URI + NEXT_PUBLIC_STEALTH_REGISTRY_ADDRESS + NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS
npm run dev
```

Contracts: [`veilex-contracts`](https://github.com/nickthelegend/veilex-contracts).
