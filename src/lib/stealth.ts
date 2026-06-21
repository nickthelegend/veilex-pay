// src/lib/stealth.ts
// Browser-compatible stealth address implementation
// Uses @noble/curves and @noble/hashes - lightweight and modern

import { secp256k1 } from "@noble/curves/secp256k1";
import { keccak_256 } from "@noble/hashes/sha3";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";

export interface StealthKeys {
  spendingPrivKey: string;   // 32-byte hex private key
  spendingPubKey: string;    // 33-byte compressed public key hex
  viewingPrivKey: string;    // 32-byte hex private key
  viewingPubKey: string;     // 33-byte compressed public key hex
  stealthMetaAddress: string; // spendingPub + viewingPub concatenated
}

// Generate a fresh stealth keypair for a new user
export function generateStealthKeys(): StealthKeys {
  const spendingPriv = secp256k1.utils.randomPrivateKey();
  const viewingPriv = secp256k1.utils.randomPrivateKey();

  const spendingPubKey = secp256k1.getPublicKey(spendingPriv, true);
  const viewingPubKey = secp256k1.getPublicKey(viewingPriv, true);

  return {
    spendingPrivKey: bytesToHex(spendingPriv),
    spendingPubKey: bytesToHex(spendingPubKey),
    viewingPrivKey: bytesToHex(viewingPriv),
    viewingPubKey: bytesToHex(viewingPubKey),
    stealthMetaAddress: bytesToHex(spendingPubKey) + bytesToHex(viewingPubKey).slice(2),
  };
}

export interface StealthSendResult {
  stealthAddress: string;
  ephemeralPubKey: string;
  ephemeralPrivKey: string;
}

// Compute one-time stealth address
export function generateStealthAddress(stealthMetaAddress: string): StealthSendResult {
  const metaHex = stealthMetaAddress.replace("0x", "");
  const viewingPubKeyHex = metaHex.slice(66, 132);
  const viewingPubKey = hexToBytes(viewingPubKeyHex);

  const ephemeralPriv = secp256k1.utils.randomPrivateKey();
  const ephemeralPubKey = secp256k1.getPublicKey(ephemeralPriv, true);

  // ECDH: sharedSecret = ephemeralPriv * viewingPub
  const sharedSecret = secp256k1.getSharedSecret(ephemeralPriv, viewingPubKey, true);

  // Hash the shared secret
  const hashedSecret = keccak_256(sharedSecret);

  // Derive stealth address (using the hash as a private key)
  const stealthPriv = hashedSecret;
  const stealthPubKey = secp256k1.getPublicKey(stealthPriv, false); // Uncompressed for address
  
  // Ethereum-style address from pubkey (last 20 bytes of keccak256 of uncompressed pubkey without 0x04)
  const addressHash = keccak_256(stealthPubKey.slice(1));
  const stealthAddress = "0x" + bytesToHex(addressHash.slice(-20));

  return { 
    stealthAddress, 
    ephemeralPubKey: bytesToHex(ephemeralPubKey), 
    ephemeralPrivKey: bytesToHex(ephemeralPriv) 
  };
}

// Scan: check if an announcement belongs to this viewer
export function checkAnnouncement(
  ephemeralPubKeyHex: string,
  viewingPrivKeyHex: string,
  announcedStealthAddress: string
): { matched: boolean; stealthPrivKey?: string } {
  try {
    const viewingPrivKey = hexToBytes(viewingPrivKeyHex);
    const ephemeralPubKey = hexToBytes(ephemeralPubKeyHex);

    // ECDH: sharedSecret = viewingPriv * ephemeralPub
    const sharedSecret = secp256k1.getSharedSecret(viewingPrivKey, ephemeralPubKey, true);
    const hashedSecret = keccak_256(sharedSecret);

    const stealthPriv = hashedSecret;
    const stealthPubKey = secp256k1.getPublicKey(stealthPriv, false);
    
    const addressHash = keccak_256(stealthPubKey.slice(1));
    const candidateAddress = "0x" + bytesToHex(addressHash.slice(-20));

    if (candidateAddress.toLowerCase() === announcedStealthAddress.toLowerCase()) {
      return { matched: true, stealthPrivKey: bytesToHex(hashedSecret) };
    }
    return { matched: false };
  } catch (e) {
    console.error("Scan error:", e);
    return { matched: false };
  }
}

export function formatStealthMetaAddress(meta: string): string {
  if (!meta || meta.length < 20) return "Not registered";
  return meta.slice(0, 10) + "..." + meta.slice(-8);
}

export function encodeStealthMetaAddress(spendingPubKey: string, viewingPubKey: string): string {
  return spendingPubKey + viewingPubKey.slice(2);
}

export { bytesToHex as bytesToHex, hexToBytes as hexToBytes };
