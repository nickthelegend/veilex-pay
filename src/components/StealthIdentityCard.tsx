"use client";

// Create + register a stealth identity (ERC-5564) so others can pay you
// privately on HashKey Chain. Spending/viewing keys are generated and stored in
// your browser; only the public meta-address is published on-chain.
import { useCallback, useEffect, useState } from "react";
import { Shield, Copy, KeyRound, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "@/lib/solana/wallet/context";
import { usePrivatePay } from "@/hooks/usePrivatePay";
import { generateStealthKeys, formatStealthMetaAddress, type StealthKeys } from "@/lib/stealth";
import { loadStealthKeys, saveStealthKeys } from "@/lib/stealth-store";
import { isRegistryConfigured } from "@/lib/contracts";

export default function StealthIdentityCard() {
  const { wallet } = useWallet();
  const address = wallet?.account.address;
  const { register, getMetaAddress } = usePrivatePay();

  const [keys, setKeys] = useState<StealthKeys | null>(null);
  const [registered, setRegistered] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [showView, setShowView] = useState(false);

  useEffect(() => {
    setKeys(loadStealthKeys(address));
  }, [address]);

  const refreshRegistration = useCallback(async () => {
    if (!address || !isRegistryConfigured()) {
      setRegistered(null);
      return;
    }
    try {
      const meta = await getMetaAddress(address as `0x${string}`);
      setRegistered(!!meta);
    } catch {
      setRegistered(null);
    }
  }, [address, getMetaAddress]);

  useEffect(() => {
    void refreshRegistration();
  }, [refreshRegistration]);

  const createIdentity = () => {
    if (!address) return;
    const k = generateStealthKeys();
    saveStealthKeys(address, k);
    setKeys(k);
    toast.success("Stealth identity created", {
      description: "Keys saved in your browser. Register on-chain to start receiving private payments.",
    });
  };

  const doRegister = async () => {
    if (!keys) return;
    setBusy(true);
    try {
      await register(keys.stealthMetaAddress);
      await refreshRegistration();
    } catch {
      /* toast handled in usePrivatePay */
    } finally {
      setBusy(false);
    }
  };

  const copy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  };

  return (
    <div className="main-card" style={{ marginTop: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <Shield size={22} color="var(--primary)" />
        <h3 style={{ fontWeight: 800, margin: 0 }}>Stealth Identity</h3>
        {registered === true && (
          <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px", color: "#22c55e", fontSize: "12px", fontWeight: 800 }}>
            <CheckCircle2 size={14} /> Registered
          </span>
        )}
        {registered === false && (
          <span style={{ marginLeft: "auto", color: "var(--accent)", fontSize: "12px", fontWeight: 800 }}>Not registered</span>
        )}
      </div>

      {!keys ? (
        <>
          <p style={{ fontSize: "14px", color: "var(--accent)", lineHeight: 1.5, marginTop: 0 }}>
            Generate a spending + viewing keypair. Others derive one-time stealth addresses from your public meta-address — your main wallet never appears on the payment.
          </p>
          <button
            onClick={createIdentity}
            style={{ width: "100%", padding: "16px", borderRadius: "16px", background: "var(--primary)", color: "var(--foreground)", border: "none", fontWeight: 800, fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          >
            <KeyRound size={18} /> Create Stealth Identity
          </button>
        </>
      ) : (
        <>
          <label className="label-caps" style={{ display: "block", color: "var(--accent)", marginBottom: "6px" }}>Meta-address (public)</label>
          <button
            onClick={() => copy("0x" + keys.stealthMetaAddress, "Meta-address")}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", padding: "12px", borderRadius: "12px", background: "rgba(0,0,0,0.03)", border: "1px solid var(--border)", cursor: "pointer", marginBottom: "12px" }}
          >
            <span style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--foreground)" }}>
              {formatStealthMetaAddress(keys.stealthMetaAddress)}
            </span>
            <Copy size={14} color="var(--accent)" />
          </button>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <label className="label-caps" style={{ color: "var(--accent)" }}>Viewing key (share for compliance)</label>
            <button onClick={() => setShowView((s) => !s)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)" }}>
              {showView ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <button
            onClick={() => copy(keys.viewingPrivKey, "Viewing key")}
            style={{ width: "100%", textAlign: "left", padding: "12px", borderRadius: "12px", background: "rgba(0,0,0,0.03)", border: "1px solid var(--border)", cursor: "pointer", marginBottom: "16px", fontFamily: "monospace", fontSize: "11px", color: "var(--accent)", wordBreak: "break-all" }}
          >
            {showView ? keys.viewingPrivKey : "•".repeat(40)}
          </button>

          {registered !== true && (
            <button
              onClick={doRegister}
              disabled={busy}
              style={{ width: "100%", padding: "16px", borderRadius: "16px", background: "var(--foreground)", color: "#fff", border: "none", fontWeight: 800, fontSize: "15px", cursor: "pointer", opacity: busy ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              {busy ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} color="var(--primary)" />}
              {busy ? "Registering…" : "Register On-Chain"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
