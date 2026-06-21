"use client";

import { useEffect, useState } from "react";
import { Layers, FileCheck, Inbox } from "lucide-react";
import { getFills, getBook } from "@/lib/api";

const PAIR = "dUSDC/HSK";

type Fill = { price: number; size: number; taker: string; maker: string; createdAt: string };

const short = (a: string) => (a && a.length > 10 ? `${a.slice(0, 5)}…${a.slice(-3)}` : a || "—");

export default function DarkOrderBook() {
  const [fills, setFills] = useState<Fill[]>([]);
  const [depth, setDepth] = useState({ bids: 0, asks: 0 });

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [f, b] = await Promise.all([getFills(PAIR), getBook(PAIR)]);
        if (!alive) return;
        setFills(f.fills || []);
        setDepth({ bids: (b.bids || []).length, asks: (b.asks || []).length });
      } catch {
        /* API not configured / offline — keep showing empty state */
      }
    };
    load();
    const t = setInterval(load, 5000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const totalVolume = fills.reduce((s, f) => s + f.size * f.price, 0);
  const formatVolume = (vol: number) =>
    vol >= 1_000_000 ? `${(vol / 1_000_000).toFixed(2)}M` : vol >= 1_000 ? `${(vol / 1_000).toFixed(1)}K` : vol.toFixed(2);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
          <Layers size={20} color="var(--primary)" /> Live Matches
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(204,255,0,0.1)", padding: "4px 10px", borderRadius: "20px", border: "1px solid var(--border)" }}>
          <div style={{ width: "6px", height: "6px", background: "var(--primary)", borderRadius: "50%" }} />
          <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--primary)", textTransform: "uppercase" }}>Live</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {fills.length === 0 && (
          <div className="main-card" style={{ padding: "40px 20px", textAlign: "center" }}>
            <Inbox size={40} color="var(--accent)" style={{ opacity: 0.2, marginBottom: "12px" }} />
            <p style={{ fontWeight: 800, margin: 0 }}>No matches yet</p>
            <p style={{ fontSize: "12px", color: "var(--accent)", marginTop: "6px" }}>Submit a limit order to seed the dark pool.</p>
          </div>
        )}

        {fills.map((s, i) => (
          <div key={`${s.createdAt}-${i}`} className="main-card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "8px", height: "8px", background: "var(--primary)", borderRadius: "50%" }} />
                <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--primary)", textTransform: "uppercase" }}>Settled Match</span>
              </div>
              <span style={{ fontSize: "10px", color: "var(--accent)" }}>
                {new Date(s.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "4px", height: "4px", background: "#4ade80", borderRadius: "50%", opacity: 0.5 }} />
                  <span style={{ fontSize: "12px", color: "var(--accent)", fontFamily: "monospace" }}>maker {short(s.maker)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "4px", height: "4px", background: "#3b82f6", borderRadius: "50%", opacity: 0.5 }} />
                  <span style={{ fontSize: "12px", color: "var(--accent)", fontFamily: "monospace" }}>taker {short(s.taker)}</span>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "18px", fontWeight: 800, color: "var(--foreground)", margin: 0 }}>
                  {s.size}
                  <span style={{ fontSize: "10px", color: "var(--accent)", marginLeft: "4px" }}>dUSDC</span>
                </p>
                <p style={{ fontSize: "12px", color: "var(--primary)", fontWeight: 800, margin: 0 }}>@ {s.price} HSK</p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary)" }}>
                <FileCheck size={12} />
                <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase" }}>Matched off-chain</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
        <div className="main-card" style={{ padding: "16px" }}>
          <h4 className="label-caps" style={{ color: "var(--accent)", marginBottom: "4px", margin: 0 }}>Matched Volume</h4>
          <p style={{ fontSize: "16px", fontWeight: 800, color: "var(--foreground)", margin: 0 }}>{formatVolume(totalVolume)} HSK</p>
        </div>
        <div className="main-card" style={{ padding: "16px" }}>
          <h4 className="label-caps" style={{ color: "var(--accent)", marginBottom: "4px", margin: 0 }}>Open Levels</h4>
          <p style={{ fontSize: "16px", fontWeight: 800, color: "var(--primary)", margin: 0 }}>{depth.bids + depth.asks}</p>
        </div>
      </div>
    </div>
  );
}
