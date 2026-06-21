"use client";

import { useState } from "react";
import { Shield, RefreshCcw, Wallet, Copy, Check } from "lucide-react";
import { useWallet } from "@/lib/solana/wallet/context";
import { useBalance } from "@/lib/solana/hooks/use-balance";

export default function VirtualCard() {
    const { wallet } = useWallet();
    const address = wallet?.account.address;
    const { balance, isLoading } = useBalance(address);
    const [copied, setCopied] = useState(false);
    
    // Mock data for profile and payments
    const profile = address ? { spendingPubKey: "8xH...k9P", viewingPubKey: "2vM...q4X" } : null;
    const payments = address ? [1, 2, 3] : [];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!address) return null;

    return (
        <div style={{ width: '100%' }}>
            {/* The Visual Card */}
            <div style={{
                width: '100%',
                aspectRatio: '1.586/1', // Standard CR80 ratio
                background: 'linear-gradient(135deg, var(--foreground) 0%, #000000 100%)',
                borderRadius: '32px',
                padding: '32px',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '48px', height: '48px', background: 'rgba(204, 255, 0, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Shield size={24} color="var(--primary)" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'white', margin: 0 }}>Obolus</h3>
                            <p style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>Private SOL Card</p>
                        </div>
                    </div>
                    <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '12px', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }} />
                        Solana Devnet
                    </div>
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 800, margin: 0 }}>Balance</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                        <h2 style={{ fontSize: '40px', fontWeight: 800, color: 'white', margin: 0 }}>
                            {isLoading ? "---" : balance?.toFixed(4)}
                        </h2>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>SOL</span>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
                    <div>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 800, margin: 0 }}>Stealth ID</p>
                        <p style={{ fontFamily: 'monospace', fontSize: '14px', color: 'white', opacity: 0.8, margin: 0 }}>
                            {profile ? "8xH...k9P" : "Not registered"}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <div style={{ width: '32px', height: '20px', borderRadius: '4px', background: 'white', opacity: 0.1 }} />
                        <div style={{ width: '32px', height: '20px', borderRadius: '4px', background: 'var(--primary)', opacity: 0.3 }} />
                    </div>
                </div>
            </div>

            {/* Quick Actions/Info below card */}
            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="main-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <Wallet size={18} color="var(--primary)" />
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent)' }}>Usage</span>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--foreground)' }}>
                        {payments?.length ?? 0}
                        <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--accent)', marginLeft: '6px' }}>Payments</span>
                    </div>
                </div>
                <div className="main-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <RefreshCcw size={18} color="var(--primary)" />
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent)' }}>Status</span>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Active
                        <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }} />
                    </div>
                </div>
            </div>

                <button 
                    onClick={() => {
                        if (profile) copyToClipboard("8xH...k9P...2vM...q4X");
                    }}
                    style={{
                        width: '100%',
                        marginTop: '16px',
                        padding: '20px',
                        background: 'transparent',
                        border: '1px dashed var(--border)',
                        borderRadius: '24px',
                        color: 'var(--accent)',
                        fontSize: '14px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    {copied ? <Check size={18} color="var(--primary)" /> : <Copy size={18} />}
                    {copied ? "Copied Stealth ID" : "Copy Stealth ID"}
                </button>
        </div>
    );
}
