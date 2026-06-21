"use client";

import { useState } from "react";
import { QrCode, Shield, Loader2, Inbox as InboxIcon } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import PageTransition from "@/components/PageTransition"
import { useWallet } from "@/lib/solana/wallet/context";

export default function InboxPage() {
    const { wallet, status } = useWallet();
    const isConnected = status === "connected";
    const address = wallet?.account.address;
    
    // Scan State
    const [spendPubKey, setSpendPubKey] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<any[]>([]);

    const handleScan = async () => {
        if (!spendPubKey) return;
        setIsScanning(true);
        try {
            // Mock scanning for Solana
            await new Promise(resolve => setTimeout(resolve, 3000));
            setScanResult([]); // No payments found in mock
            setIsScanning(false);
        } catch (err: any) {
            alert("Scan failed: " + err.message);
            setIsScanning(false);
        }
    };

    if (!isConnected) {
        return (
            <div className="mobile-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <Shield size={64} color="var(--primary)" style={{ marginBottom: '24px', opacity: 0.2 }} />
                <h2 className="subheading" style={{ marginBottom: '12px' }}>Vault Locked</h2>
                <p style={{ color: 'var(--accent)', textAlign: 'center', marginBottom: '30px' }}>Connect your wallet to access your private inbox.</p>
                <MobileNav />
            </div>
        );
    }

    return (
        <div className="mobile-container" style={{ paddingBottom: '100px' }}>
            <header style={{ padding: '56px 20px 24px', borderBottom: '1px solid var(--border)' }}>
                <h1 style={{ fontSize: '30px', fontWeight: 800, margin: 0 }}>
                    Your <span style={{ color: 'var(--primary)' }}>Inbox</span>
                </h1>
            </header>

            <PageTransition>
                <main style={{ padding: '0 20px' }}>
                    <div style={{ marginTop: '24px' }}>
                        <div className="main-card" style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <Shield size={24} color="var(--primary)" />
                                <h3 style={{ fontWeight: 800, margin: 0 }}>Secure Scanner</h3>
                            </div>
                            <p style={{ fontSize: '14px', color: 'var(--accent)', lineHeight: 1.5, margin: 0 }}>
                                Enter your spend key to scan for private Solana payments. Funds discovered will appear below.
                            </p>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label className="label-caps" style={{ display: 'block', color: 'var(--accent)', marginBottom: '8px' }}>Spend Public Key</label>
                            <input 
                                type="text"
                                value={spendPubKey}
                                onChange={(e) => setSpendPubKey(e.target.value)}
                                placeholder="Enter public key..."
                                style={{
                                    width: '100%',
                                    background: '#ffffff',
                                    border: '1px solid var(--border)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    color: 'var(--foreground)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    fontFamily: 'monospace',
                                    fontWeight: 600
                                }}
                            />
                        </div>

                        <button 
                            onClick={handleScan}
                            disabled={isScanning || !spendPubKey}
                            style={{
                                width: '100%',
                                padding: '20px',
                                borderRadius: '24px',
                                background: 'var(--foreground)',
                                color: '#ffffff',
                                border: 'none',
                                fontWeight: 800,
                                fontSize: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                cursor: 'pointer',
                                opacity: (isScanning || !spendPubKey) ? 0.5 : 1
                            }}
                        >
                            {isScanning ? <Loader2 size={24} className="animate-spin" /> : <QrCode size={22} color="var(--primary)" />}
                            {isScanning ? `Scanning Blocks...` : "Scan for Payments"}
                        </button>

                        {scanResult.length === 0 && !isScanning && (
                            <div className="main-card" style={{ marginTop: '32px', textAlign: 'center', padding: '60px 20px' }}>
                                <InboxIcon size={48} color="var(--accent)" style={{ opacity: 0.2, marginBottom: '16px' }} />
                                <p style={{ fontWeight: 800, margin: 0 }}>Inbox is empty</p>
                                <p style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '8px' }}>Scan to discover hidden transactions.</p>
                            </div>
                        )}
                    </div>
                </main>
            </PageTransition>

            <MobileNav />
        </div>
    );
}
