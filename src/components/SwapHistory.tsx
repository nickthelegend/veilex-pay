"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, CircleDashed, XCircle, Clock, History, Lock } from "lucide-react";
import { useWallet } from "@/lib/solana/wallet/context";
import { getMyOrders, cancelOrder } from "@/lib/api";
import { toast } from "sonner";

const PAIR = "dUSDC/HSK";
type Order = { _id: string; pair: string; side: string; price: number; size: number; remaining: number; status: string; createdAt: string };

export default function SwapHistory() {
  const { wallet, status } = useWallet();
  const address = wallet?.account.address;
  const isConnected = status === "connected";
  const [orders, setOrders] = useState<Order[]>([]);

  const load = useCallback(async () => {
    if (!address) {
      setOrders([]);
      return;
    }
    try {
      const r = await getMyOrders(address);
      setOrders(r.orders || []);
    } catch {
      /* offline */
    }
  }, [address]);

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [load]);

  const cancel = async (id: string) => {
    if (!address) return;
    try {
      await cancelOrder(id, address);
      toast.success("Order cancelled");
      load();
    } catch (e) {
      toast.error("Cancel failed", { description: e instanceof Error ? e.message : String(e) });
    }
  };

  const statusIcon = (s: string) =>
    s === "open" ? <CircleDashed size={14} color="var(--primary)" className="animate-spin" /> : s === "filled" ? <CheckCircle2 size={14} color="#4ade80" /> : <XCircle size={14} color="#ef4444" />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h3 style={{ fontSize: "20px", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
        <History size={20} color="var(--accent)" /> Your Orders
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 800, color: "var(--primary)", textTransform: "uppercase" }}>
          <Lock size={11} /> Private
        </span>
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {!isConnected || orders.length === 0 ? (
          <div className="main-card" style={{ padding: "32px 20px", textAlign: "center" }}>
            <p className="label-caps" style={{ color: "var(--accent)", margin: 0 }}>
              {isConnected ? "No orders yet — your shielded orders appear here" : "Connect to view your orders"}
            </p>
          </div>
        ) : (
          orders.map((o) => (
            <div key={o._id} className="main-card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {statusIcon(o.status)}
                  <span style={{ fontSize: "10px", fontWeight: 800, color: o.status === "open" ? "var(--primary)" : "var(--accent)", textTransform: "uppercase" }}>{o.status}</span>
                </div>
                <span style={{ fontSize: "10px", color: "var(--accent)" }}>{new Date(o.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", background: "rgba(204,255,0,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
                    <Lock size={13} color="var(--primary)" />
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 800, color: "var(--foreground)", margin: 0 }}>{o.pair}</p>
                    <p style={{ fontSize: "10px", color: o.side === "buy" ? "#4ade80" : "#ef4444", fontWeight: 800, textTransform: "uppercase", margin: 0 }}>{o.side} order</p>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "14px", fontWeight: 800, color: "var(--foreground)", margin: 0 }}>
                    {o.remaining}/{o.size} <span style={{ fontSize: "10px", color: "var(--accent)" }}>dUSDC</span>
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--accent)", margin: 0 }}>@ {o.price}</p>
                </div>
              </div>

              {o.status === "open" && (
                <button onClick={() => cancel(o._id)} style={{ alignSelf: "flex-end", padding: "4px 10px", borderRadius: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: "11px", fontWeight: 800, cursor: "pointer" }}>
                  Cancel
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
