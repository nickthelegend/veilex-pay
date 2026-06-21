"use client";

import { 
  CheckCircle2, 
  CircleDashed, 
  XCircle, 
  Clock, 
  History
} from "lucide-react";
import { useWallet } from "@/lib/solana/wallet/context";

export default function SwapHistory() {
  const { status } = useWallet();
  const isConnected = status === "connected";

  // Mock data for swap history
  const orders = isConnected ? [
    { id: "1", status: "filled", createdAt: Date.now() - 3600000, side: "buy", amount: "100.00", price: "125.40", pair: "PUSD / SOL" },
    { id: "2", status: "active", createdAt: Date.now() - 600000, side: "sell", amount: "50.00", price: "128.10", pair: "PUSD / SOL" },
  ] : [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CircleDashed size={14} color="var(--primary)" className="animate-spin" />;
      case "filled": return <CheckCircle2 size={14} color="#4ade80" />;
      case "cancelled": return <XCircle size={14} color="#ef4444" />;
      default: return <Clock size={14} color="var(--accent)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
        <History size={20} color="var(--accent)" /> Order History
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {orders.length === 0 ? (
          <div className="main-card" style={{ padding: '32px 20px', textAlign: 'center' }}>
            <p className="label-caps" style={{ color: 'var(--accent)', margin: 0 }}>No active private orders</p>
          </div>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="main-card" style={{ 
              padding: '16px', 
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   {getStatusIcon(o.status)}
                   <span style={{ fontSize: '10px', fontWeight: 800, color: o.status === 'active' ? 'var(--primary)' : 'var(--accent)', textTransform: 'uppercase' }}>
                      {o.status}
                   </span>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--accent)' }}>
                   {Math.floor((Date.now() - o.createdAt) / 1000 / 60)}m ago
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <div style={{ width: '32px', height: '32px', background: 'rgba(204,255,0,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--primary)' }}>ZK</span>
                   </div>
                   <div>
                      <p style={{ fontSize: '14px', fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>{o.pair}</p>
                      <p style={{ fontSize: '10px', color: o.side === 'buy' ? '#4ade80' : '#ef4444', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>{o.side} Order</p>
                   </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                   <p style={{ fontSize: '14px', fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>{o.amount} <span style={{ fontSize: '10px', color: 'var(--accent)' }}>PUSD</span></p>
                   <p style={{ fontSize: '12px', color: 'var(--accent)', margin: 0 }}>@ {o.price}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
