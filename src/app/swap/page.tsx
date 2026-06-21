"use client";

import SwapInterface from "@/components/SwapInterface";
import DarkOrderBook from "@/components/DarkOrderBook";
import SwapHistory from "@/components/SwapHistory";
import MobileNav from "@/components/MobileNav";
import PageTransition from "@/components/PageTransition";
import { Shield } from "lucide-react";
import { useWallet } from "@/lib/solana/wallet/context";

export default function SwapPage() {
    const { status } = useWallet();
    const isConnected = status === "connected";

    if (!isConnected) {
        return (
            <div className="mobile-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div className="main-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
                    <Shield size={64} color="var(--primary)" style={{ marginBottom: '24px', opacity: 0.2 }} />
                    <h2 className="subheading" style={{ marginBottom: '12px' }}>Private Swap Locked</h2>
                    <p style={{ color: 'var(--accent)', textAlign: 'center', marginBottom: '30px' }}>Connect your wallet to trade privately in the Dark Pool.</p>
                </div>
                <MobileNav />
            </div>
        );
    }

    return (
        <div className="mobile-container" style={{ paddingBottom: '110px' }}>
            <header style={{ padding: '56px 20px 24px', borderBottom: '1px solid var(--border)' }}>
                <h1 style={{ fontSize: '30px', fontWeight: 800, margin: 0 }}>
                    Swap <span style={{ color: 'var(--primary)' }}>Privately</span>
                </h1>
            </header>

            <PageTransition>
                <main style={{ padding: '0 20px', marginTop: '24px' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <SwapInterface />
                    </div>

                    <div style={{ marginBottom: '40px' }}>
                         <DarkOrderBook />
                    </div>

                    <div style={{ paddingBottom: '20px' }}>
                         <SwapHistory />
                    </div>
                </main>
            </PageTransition>

            <MobileNav />
        </div>
    );
}
