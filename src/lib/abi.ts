// ABI for the Veilex StealthRegistry (ERC-5564) deployed on HashKey Chain.
// Mirrors ../veilex-contracts/src/privacy/StealthRegistry.sol.
export const STEALTH_REGISTRY_ABI = [
  {
    type: "function",
    name: "registerStealthMetaAddress",
    stateMutability: "nonpayable",
    inputs: [
      { name: "schemeId", type: "uint256" },
      { name: "stealthMetaAddress", type: "bytes" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "getStealthMetaAddress",
    stateMutability: "view",
    inputs: [
      { name: "user", type: "address" },
      { name: "schemeId", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bytes" }],
  },
  {
    type: "function",
    name: "announce",
    stateMutability: "nonpayable",
    inputs: [
      { name: "schemeId", type: "uint256" },
      { name: "stealthAddress", type: "address" },
      { name: "ephemeralPubKey", type: "bytes" },
      { name: "metadata", type: "bytes" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "privateTransfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "token", type: "address" },
      { name: "stealthAddress", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "ephemeralPubKey", type: "bytes" },
      { name: "viewTag", type: "bytes1" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "privateTransferNative",
    stateMutability: "payable",
    inputs: [
      { name: "stealthAddress", type: "address" },
      { name: "ephemeralPubKey", type: "bytes" },
      { name: "viewTag", type: "bytes1" },
    ],
    outputs: [],
  },
  {
    type: "event",
    name: "Announcement",
    inputs: [
      { name: "schemeId", type: "uint256", indexed: true },
      { name: "stealthAddress", type: "address", indexed: true },
      { name: "caller", type: "address", indexed: true },
      { name: "ephemeralPubKey", type: "bytes", indexed: false },
      { name: "metadata", type: "bytes", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "StealthMetaAddressSet",
    inputs: [
      { name: "registrant", type: "address", indexed: true },
      { name: "schemeId", type: "uint256", indexed: true },
      { name: "stealthMetaAddress", type: "bytes", indexed: false },
    ],
    anonymous: false,
  },
] as const;
