"use client";

import { useState, useEffect } from "react";
import { Send, QrCode, Shield, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import PageTransition from "@/components/PageTransition";
import { useWallet } from "@/lib/solana/wallet/context";
import Link from "next/link";

export default function PaymentsPage() {
    const { wallet, status } = useWallet();
    const isConnected = status === "connected";
    const address = wallet?.account.address;
    
    // Send State
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);

    const handleSend = async () => {
        if (!address || !recipient || !amount) return;
        setIsSending(true);

        try {
            // Mocking payment dispatch for Solana
            await new Promise(resolve => setTimeout(resolve, 2000));
            setTxHash("mock_solana_tx_hash_" + Math.random().toString(36).substring(7));
            setIsSending(false);
            setRecipient("");
            setAmount("");

        } catch (err: any) {
            alert(err.message || "Send failed");
            setIsSending(false);
        }
    };

    if (!isConnected) {
        return (
            <div className="mobile-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div className="main-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
                    <Shield size={64} color="var(--primary)" style={{ marginBottom: '24px', opacity: 0.5 }} />
                    <h2 className="subheading" style={{ marginBottom: '12px' }}>Private Vault Locked</h2>
                    <p style={{ color: 'var(--accent)', marginBottom: '30px' }}>Connect your wallet to send shielded payments.</p>
                </div>
                <MobileNav />
            </div>
        );
    }

    return (
        <div className="mobile-container" style={{ paddingBottom: '120px' }}>
            <header style={{ padding: '56px 20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link href="/dashboard" style={{ color: 'var(--foreground)' }}>
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <span className="label-caps" style={{ color: 'var(--accent)' }}>Secure Transfer</span>
                    <h1 style={{ fontSize: '30px', fontWeight: 900, margin: 0 }}>Send <span style={{ color: 'var(--primary)' }}>Privately</span></h1>
                </div>
            </header>

            <PageTransition>
                <main style={{ padding: '0 20px' }}>
                    <div className="main-card" style={{ marginTop: '16px' }}>
                        <div style={{ marginBottom: '24px' }}>
                            <label className="label-caps" style={{ display: 'block', color: 'var(--accent)', marginBottom: '12px' }}>Recipient Identity</label>
                            <div style={{ position: 'relative' }}>
                                <textarea 
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    placeholder="Enter Solana address..."
                                    style={{
                                        width: '100%',
                                        height: '120px',
                                        background: 'rgba(183, 198, 194, 0.05)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '24px',
                                        padding: '20px',
                                        color: 'var(--foreground)',
                                        fontSize: '14px',
                                        outline: 'none',
                                        fontFamily: 'monospace',
                                        resize: 'none',
                                        fontWeight: 600
                                    }}
                                />
                                <QrCode size={20} color="var(--primary)" style={{ position: 'absolute', bottom: '20px', right: '20px', opacity: 0.5 }} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <label className="label-caps" style={{ display: 'block', color: 'var(--accent)', marginBottom: '12px' }}>Amount to Shield</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    style={{
                                        width: '100%',
                                        background: 'rgba(183, 198, 194, 0.05)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '24px',
                                        padding: '20px 24px',
                                        color: 'var(--foreground)',
                                        fontSize: '32px',
                                        fontWeight: 900,
                                        outline: 'none'
                                    }}
                                />
                                <span style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--accent)' }}>SOL</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleSend}
                            disabled={isSending || !recipient || !amount}
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
                                transition: 'all 0.2s ease',
                                opacity: (isSending || !recipient || !amount) ? 0.5 : 1
                            }}
                        >
                            {isSending ? <Loader2 size={24} className="animate-spin" /> : <Send size={22} color="var(--primary)" />}
                            {isSending ? "Encrypting Vault..." : "Dispatch Shielded Payment"}
                        </button>
                    </div>

                    {txHash && (
                        <div className="nested-card" style={{ marginTop: '24px', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.2)', display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <CheckCircle2 size={24} color="#22c55e" />
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '14px', fontWeight: 800, color: '#22c55e', margin: 0 }}>Payment Dispatched</p>
                                <a 
                                    href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'underline' }}
                                >
                                    Verify on Solana Explorer
                                </a>
                            </div>
                        </div>
                    )}
                </main>
            </PageTransition>

            <MobileNav />
        </div>
    );
}
