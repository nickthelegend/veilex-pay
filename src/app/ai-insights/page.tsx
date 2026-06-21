"use client";

import { Sparkles } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import PageTransition from "@/components/PageTransition";
import AIInsights from "@/components/AIInsights";
import { useWallet } from "@/lib/solana/wallet/context";

export default function AIInsightsPage() {
    const { status } = useWallet();
    const isConnected = status === "connected";

    if (!isConnected) {
        return (
            <div className="mobile-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div className="main-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
                    <Sparkles size={64} color="var(--primary)" style={{ marginBottom: '24px', opacity: 0.2 }} />
                    <h2 className="subheading" style={{ marginBottom: '12px' }}>AI Analysis Locked</h2>
                    <p style={{ color: 'var(--accent)', marginBottom: '30px' }}>Connect your wallet to analyze your privacy score and get AI-driven insights.</p>
                </div>
                <MobileNav />
            </div>
        );
    }

    return (
        <div className="mobile-container" style={{ paddingBottom: '100px' }}>
            <header style={{ padding: '56px 20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 style={{ fontSize: '30px', fontWeight: 800, margin: 0 }}>
                    AI <span style={{ color: 'var(--primary)' }}>Insights</span>
                </h1>
                <div style={{ padding: '8px 12px', background: 'rgba(204, 255, 0, 0.1)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }} />
                    <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>Live</span>
                </div>
            </header>

            <PageTransition>
                <main style={{ padding: '0 20px', marginTop: '24px' }}>
                    <AIInsights />
                </main>
            </PageTransition>

            <MobileNav />
        </div>
    );
}
