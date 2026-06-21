"use client";

import { 
  Layers, 
  FileCheck,
  ArrowUpRight
} from "lucide-react";

export default function DarkOrderBook() {
  // Mock data for settlements
  const settlements = [
    { id: "1", commitmentA: "8xH...k9P", commitmentB: "2vM...q4X", fillAmount: "124.50", settlementPrice: "126.40", timestamp: Date.now() - 120000, txHash: "mock_tx_1" },
    { id: "2", commitmentA: "5nL...p8R", commitmentB: "9tK...s2Z", fillAmount: "88.20", settlementPrice: "126.35", timestamp: Date.now() - 450000, txHash: "mock_tx_2" },
  ];

  const stats = {
    totalVolume: 1240500,
    activeNodes: 12
  };

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(2)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(1)}K`;
    return `$${vol.toFixed(2)}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <Layers size={20} color="var(--primary)" /> Live Matches
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(204,255,0,0.1)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <div style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }} />
          <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>Live</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {settlements.map((s) => (
            <div key={s.id} className="main-card" style={{ 
              padding: '16px', 
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }} />
                   <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>Settled Match</span>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--accent)' }}>
                  {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '4px', height: '4px', background: '#4ade80', borderRadius: '50%', opacity: 0.5 }} />
                      <span style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'monospace' }}>{s.commitmentA}</span>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '4px', height: '4px', background: '#3b82f6', borderRadius: '50%', opacity: 0.5 }} />
                      <span style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'monospace' }}>{s.commitmentB}</span>
                   </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                   <p style={{ fontSize: '18px', fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>
                      {s.fillAmount}
                      <span style={{ fontSize: '10px', color: 'var(--accent)', marginLeft: '4px' }}>PUSD</span>
                   </p>
                   <p style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 800, margin: 0 }}>
                      @ {s.settlementPrice} SOL
                   </p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)' }}>
                    <FileCheck size={12} />
                    <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>ZK Verified</span>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent)', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>
                   Solana Explorer <ArrowUpRight size={10} />
                 </div>
              </div>
            </div>
          ))}
      </div>

      {/* Protocol Stats Summary */}
      <div style={{ display: grid, gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
         <div className="main-card" style={{ padding: '16px' }}>
            <h4 className="label-caps" style={{ color: 'var(--accent)', marginBottom: '4px', margin: 0 }}>Total Volume</h4>
            <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>
              {formatVolume(stats.totalVolume)}
            </p>
         </div>
         <div className="main-card" style={{ padding: '16px' }}>
            <h4 className="label-caps" style={{ color: 'var(--accent)', marginBottom: '4px', margin: 0 }}>Active Nodes</h4>
            <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
              {stats.activeNodes.toLocaleString()}
            </p>
         </div>
      </div>
    </div>
  );
}
