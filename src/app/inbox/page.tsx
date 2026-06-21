"use client";

import { useState } from "react";
import { formatUnits } from "viem";
import { QrCode, Shield, Loader2, Inbox as InboxIcon, ExternalLink, KeyRound } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import PageTransition from "@/components/PageTransition";
import { useWallet } from "@/lib/solana/wallet/context";
import { useAnnouncementScanner } from "@/hooks/useAnnouncementScanner";
import { hskTxUrl } from "@/lib/evm";

export default function InboxPage() {
    const { wallet, status } = useWallet();
    const isConnected = status === "connected";
    const address = wallet?.account.address;

    const { scan, isScanning, matches, scanned, error } = useAnnouncementScanner(address);
    const [viewKeyOverride, setViewKeyOverride] = useState("");
    const [hasScanned, setHasScanned] = useState(false);

    const handleScan = async () => {
        setHasScanned(true);
        await scan(viewKeyOverride.trim() || undefined);
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
                                Scans StealthRegistry announcements on HashKey Chain with your <strong>viewing key</strong> (kept in your browser) to find payments only you can detect.
                            </p>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label className="label-caps" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', marginBottom: '8px' }}>
                                <KeyRound size={12} /> Viewing key (optional — auto-uses your identity)
                            </label>
                            <input
                                type="text"
                                value={viewKeyOverride}
                                onChange={(e) => setViewKeyOverride(e.target.value)}
                                placeholder="Leave blank to use your saved stealth identity"
                                style={{
                                    width: '100%',
                                    background: '#ffffff',
                                    border: '1px solid var(--border)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    color: 'var(--foreground)',
                                    fontSize: '13px',
                                    outline: 'none',
                                    fontFamily: 'monospace',
                                    fontWeight: 600
                                }}
                            />
                        </div>

                        <button
                            onClick={handleScan}
                            disabled={isScanning}
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
                                opacity: isScanning ? 0.5 : 1
                            }}
                        >
                            {isScanning ? <Loader2 size={24} className="animate-spin" /> : <QrCode size={22} color="var(--primary)" />}
                            {isScanning ? `Scanning blocks…` : "Scan for Payments"}
                        </button>

                        {error && (
                            <div className="main-card" style={{ marginTop: '16px', borderColor: 'rgba(239,68,68,0.3)' }}>
                                <p style={{ fontSize: '12px', color: '#ef4444', margin: 0 }}>{error}</p>
                            </div>
                        )}

                        {!isScanning && hasScanned && !error && (
                            <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--accent)', marginTop: '12px' }}>
                                Scanned {scanned} announcement{scanned === 1 ? '' : 's'} · {matches.length} match{matches.length === 1 ? '' : 'es'}
                            </p>
                        )}

                        {matches.length > 0 && (
                            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {matches.map((m, i) => (
                                    <div key={`${m.txHash}-${i}`} className="main-card" style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <span style={{ fontWeight: 900, fontSize: '20px', color: 'var(--primary)' }}>
                                                {Number(formatUnits(m.amountWei, 18)).toLocaleString(undefined, { maximumFractionDigits: 6 })} {m.isNative ? 'HSK' : 'TOKEN'}
                                            </span>
                                            <a href={hskTxUrl(m.txHash)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                                                <ExternalLink size={16} />
                                            </a>
                                        </div>
                                        <p style={{ fontSize: '11px', color: 'var(--accent)', margin: 0, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                            stealth: {m.stealthAddress}
                                        </p>
                                        <p style={{ fontSize: '10px', color: 'var(--accent)', margin: '6px 0 0', fontFamily: 'monospace', wordBreak: 'break-all', opacity: 0.7 }}>
                                            spend key: {m.stealthPrivKey.slice(0, 14)}…{m.stealthPrivKey.slice(-8)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {matches.length === 0 && !isScanning && (
                            <div className="main-card" style={{ marginTop: '32px', textAlign: 'center', padding: '60px 20px' }}>
                                <InboxIcon size={48} color="var(--accent)" style={{ opacity: 0.2, marginBottom: '16px' }} />
                                <p style={{ fontWeight: 800, margin: 0 }}>{hasScanned ? 'No payments found' : 'Inbox is empty'}</p>
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
