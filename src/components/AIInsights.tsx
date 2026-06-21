"use client";

import { useState, useEffect } from "react";
import { Sparkles, ShieldCheck, TrendingUp, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { useWallet } from "@/lib/solana/wallet/context";

interface AIResult {
  score: number;
  insights: string[];
}

export default function AIInsights() {
  const { wallet } = useWallet();
  const address = wallet?.account.address;
  const [data, setData] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  const generateInsights = async () => {
    if (!address) return;
    setLoading(true);
    try {
      // Mock AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setData({
        score: 88,
        insights: [
            "Your stealth address rotation is optimal for Solana mainnet.",
            "Consider enabling automatic round-ups for SSP yield.",
            "Wallet hygiene looks good: no public transactions detected."
        ]
      });
    } catch (err) {
      console.error("AI Generation failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address && !data && !loading) {
      generateInsights();
    }
  }, [address]);

  if (!address) return null;

  return (
    <div style={{ width: '100%' }}>
      {/* Privacy Score Card */}
      <div className="main-card" style={{
        padding: '32px',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {loading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <Loader2 size={32} color="var(--primary)" className="animate-spin" />
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--foreground)' }}>Analyzing Ledger...</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(204, 255, 0, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Privacy Score</h3>
              <p style={{ fontSize: '12px', color: 'var(--accent)', margin: 0 }}>AI Health Rating</p>
            </div>
          </div>
          <button 
            onClick={generateInsights}
            disabled={loading}
            style={{ 
              background: 'transparent', 
              border: '1px solid var(--border)', 
              borderRadius: '10px', 
              padding: '8px 12px', 
              color: 'var(--primary)', 
              fontSize: '12px', 
              fontWeight: 800, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} />
            Refresh
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative', width: '100px', height: '100px' }}>
            <svg style={{ transform: 'rotate(-90deg)', width: '100px', height: '100px' }}>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke="var(--border)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke="var(--primary)"
                strokeWidth="8"
                strokeDasharray={`${282 * ((data?.score ?? 0) / 100)} 282`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s ease-out' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800 }}>
              {data?.score ?? ".."}%
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--foreground)', marginBottom: '8px', margin: 0 }}>
              {data?.score && data.score > 80 ? "Premium Stealth status" : "Analyzing history..."}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--accent)', lineHeight: 1.5, margin: 0 }}>
                Your Solana footprint is being analyzed for privacy leaks.
            </p>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
        <TrendingUp size={20} color="var(--primary)" />
        AI Optimization
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
        {(data?.insights ?? ["Analyzing history...", "Validating stealth usage...", "Securing metadata..."]).map((insight, i) => (
          <div 
            key={i} 
            className="main-card"
            style={{ 
              padding: '20px', 
              display: 'flex',
              gap: '16px',
            }}
          >
            <div style={{ width: '40px', height: '40px', background: 'rgba(0,0,0,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertCircle size={18} color="var(--primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1.5, margin: 0 }}>{insight}</p>
            </div>
            <div style={{ alignSelf: 'center' }}>
              <ArrowRight size={16} color="var(--accent)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
