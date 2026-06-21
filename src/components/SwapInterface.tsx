"use client";

import { useState } from "react";
import { 
  Loader2, 
  EyeOff, 
  Zap,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Wallet
} from "lucide-react";
import { useWallet } from "@/lib/solana/wallet/context";
import { useBalance } from "@/lib/solana/hooks/use-balance";

export default function SwapInterface() {
  const { wallet } = useWallet();
  const address = wallet?.account.address;
  const { balance } = useBalance(address);
  
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Vault State
  const [depositAmount, setDepositAmount] = useState("");
  const [vaultBalance, setVaultBalance] = useState("0.00");

  const handleDeposit = async () => {
    if (!depositAmount || !address) return;
    setIsSubmitting(true);
    // Mock deposit
    setTimeout(() => {
        setVaultBalance((prev) => (parseFloat(prev) + parseFloat(depositAmount)).toFixed(2));
        setDepositAmount("");
        setIsSubmitting(false);
    }, 1500);
  };

  const handleSubmitOrder = async () => {
    if (!address || !amount || !price) return;
    setIsSubmitting(true);
    // Mock order submission
    setTimeout(() => {
        setIsSubmitting(false);
        setAmount("");
        setPrice("");
        alert("Private Order Submitted to Solana Dark Pool");
    }, 2000);
  };

  const isActionDisabled = isSubmitting || !amount || !price;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Swap Section */}
      <div>
        
        {/* Toggle Selector */}
        <div style={{ 
          display: 'flex', 
          background: '#ffffff', 
          padding: '6px', 
          borderRadius: '24px', 
          marginBottom: '24px', 
          border: '1px solid var(--border)' 
        }}>
          <button 
            onClick={() => setSide("buy")}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '20px',
              border: 'none',
              background: side === "buy" ? 'var(--foreground)' : 'transparent',
              color: side === "buy" ? '#ffffff' : 'var(--accent)',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <TrendingUp size={16} /> Buy PUSD
          </button>
          <button 
            onClick={() => setSide("sell")}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '20px',
              border: 'none',
              background: side === "sell" ? 'var(--foreground)' : 'transparent',
              color: side === "sell" ? '#ffffff' : 'var(--accent)',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <TrendingDown size={16} /> Sell PUSD
          </button>
        </div>

        {/* Inputs */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label className="label-caps" style={{ color: 'var(--accent)' }}>Amount to {side}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
               <Wallet size={12} color="var(--accent)" />
               <span 
                onClick={() => setAmount(balance?.toString() || "0")}
                style={{ fontSize: '12px', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
               >
                 {balance ? balance.toFixed(2) : "0.00"} SOL
               </span>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '20px',
                paddingRight: '80px',
                color: 'var(--foreground)',
                fontSize: '20px',
                fontWeight: 800,
                outline: 'none'
              }}
            />
            <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)' }}>
               <span style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: 800 }}>PUSD</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label className="label-caps" style={{ display: 'block', color: 'var(--accent)', marginBottom: '8px' }}>Limit Price (SOL)</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '20px',
                color: 'var(--foreground)',
                fontSize: '20px',
                fontWeight: 800,
                outline: 'none'
              }}
            />
            <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)', fontSize: '14px', fontWeight: 800 }}>SOL</span>
          </div>
        </div>

        <button 
          onClick={handleSubmitOrder}
          disabled={isActionDisabled}
          style={{
            width: '100%',
            padding: '20px',
            borderRadius: '24px',
            background: 'var(--primary)',
            color: 'var(--primary-foreground)',
            border: 'none',
            fontWeight: 800,
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: 'pointer',
            opacity: isActionDisabled ? 0.5 : 1,
          }}
        >
          {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Zap size={22} />}
          {isSubmitting ? "Processing..." : "Submit Private Order"}
        </button>

        <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(204, 255, 0, 0.05)', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
          <EyeOff size={20} color="var(--primary)" />
          <p style={{ fontSize: '12px', color: 'var(--accent)', lineHeight: 1.5, margin: 0 }}>
            Orders are encrypted using Solana ZK-Token program logic. The matching engine settles trades privately without revealing price.
          </p>
        </div>
      </div>

      {/* Integrated Vault Balance Section */}
      <div className="main-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 className="label-caps" style={{ color: 'var(--accent)', margin: 0 }}>Privacy Vault</h3>
            <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px', margin: 0 }}>
              {vaultBalance}
              <span style={{ fontSize: '14px', color: 'var(--accent)', marginLeft: '8px' }}>PUSD</span>
            </p>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(204,255,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} color="var(--primary)" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input 
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="0.00"
            style={{
              flex: 1,
              background: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '14px',
              color: 'var(--foreground)',
              fontSize: '16px',
              fontWeight: 800,
              outline: 'none'
            }}
          />
          <button 
            onClick={handleDeposit}
            disabled={!depositAmount || isSubmitting}
            style={{
              padding: '0 20px',
              borderRadius: '12px',
              background: 'var(--foreground)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              opacity: (!depositAmount || isSubmitting) ? 0.5 : 1
            }}
          >
            {isSubmitting ? "..." : "Deposit"}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wallet size={14} color="var(--accent)" />
          <p style={{ fontSize: '12px', color: 'var(--accent)', margin: 0 }}>
            Public Balance: {balance?.toFixed(2) || "0.00"} SOL
          </p>
        </div>
      </div>
    </div>
  );
}
