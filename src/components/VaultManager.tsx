"use client";

import { useState } from "react";
import { Loader2, Plus, ArrowUpRight, ShieldCheck, Wallet } from "lucide-react";
import { useWallet } from "@/lib/solana/wallet/context";
import { useBalance } from "@/lib/solana/hooks/use-balance";

export default function VaultManager() {
  const { wallet } = useWallet();
  const address = wallet?.account.address;
  const { balance, refetch } = useBalance(address);
  
  const [depositAmount, setDepositAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vaultBalance, setVaultBalance] = useState("0.00");

  const handleDeposit = async () => {
    if (!depositAmount || !address) return;
    setIsSubmitting(true);
    // Mock deposit
    setTimeout(() => {
        setVaultBalance((prev) => (parseFloat(prev) + parseFloat(depositAmount)).toFixed(2));
        setDepositAmount("");
        setIsSubmitting(false);
        refetch();
    }, 1500);
  };

  return (
    <div className="main-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <ShieldCheck size={20} color="var(--primary)" />
            Privacy Vault
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--accent)', margin: 0 }}>Shield funds for private trading</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p className="label-caps" style={{ color: 'var(--accent)', margin: 0 }}>Vault Balance</p>
          <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
            {vaultBalance} 
            <span style={{ fontSize: '14px', marginLeft: '6px', color: 'var(--accent)' }}>PUSD</span>
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="number"
            placeholder="0.00"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '16px',
                color: 'var(--foreground)',
                fontSize: '18px',
                fontWeight: 800,
                outline: 'none'
            }}
          />
          <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
            <button 
              onClick={() => setDepositAmount(balance?.toString() || "0")}
              className="label-caps"
              style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '6px', color: 'var(--accent)', cursor: 'pointer' }}
            >
              Max
            </button>
          </div>
        </div>

        <button
          onClick={handleDeposit}
          disabled={isSubmitting || !depositAmount}
          style={{
            width: '100%',
            background: 'var(--primary)',
            color: 'var(--primary-foreground)',
            padding: '16px',
            borderRadius: '20px',
            border: 'none',
            fontWeight: 800,
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            opacity: (isSubmitting || !depositAmount) ? 0.6 : 1
          }}
        >
          {isSubmitting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              <Plus size={20} />
              Deposit to Vault
            </>
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wallet size={14} color="var(--accent)" />
          <p style={{ fontSize: '12px', color: 'var(--accent)', margin: 0 }}>
            Wallet Balance: {balance?.toFixed(2) || "0.00"} SOL
          </p>
        </div>
      </div>
    </div>
  );
}
