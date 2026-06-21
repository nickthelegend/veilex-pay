"use client";

import { useState } from "react";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import PageTransition from "@/components/PageTransition";
import { Loader2, Coins, ArrowRight, Wallet, CheckCircle2 } from "lucide-react";
import { useWallet } from "@/lib/solana/wallet/context";
import { useBalance } from "@/lib/solana/hooks/use-balance";

export default function FaucetPage() {
    const { wallet } = useWallet();
    const address = wallet?.account.address;
    const { balance, refetch } = useBalance(address);
    const [mintAmount, setMintAmount] = useState("10");
    const [isMinting, setIsMinting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleMint = async () => {
        if (!address) return;
        setIsMinting(true);
        setIsSuccess(false);
        try {
            // Mock minting / airdrop
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIsSuccess(true);
            refetch();
        } catch (err) {
            console.error("Minting failed", err);
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <main className="mobile-container">
            <Header title="Faucet" />
            
            <PageTransition>
                <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    
                    {/* Hero Section */}
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            background: 'rgba(204, 255, 0, 0.1)', 
                            borderRadius: '30px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            margin: '0 auto 24px' 
                        }}>
                            <Coins size={40} color="var(--primary)" />
                        </div>
                        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--foreground)', marginBottom: '12px', margin: 0 }}>
                            SOL Faucet
                        </h1>
                        <p style={{ color: 'var(--accent)', fontSize: '15px', lineHeight: 1.5, maxWidth: '280px', margin: '0 auto' }}>
                            Get testnet SOL to explore Obolus privacy features.
                        </p>
                    </div>

                    {/* Stats Card */}
                    <div className="main-card" style={{ 
                        padding: '24px', 
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Wallet size={20} color="var(--accent)" />
                                </div>
                                <div>
                                    <p className="label-caps" style={{ color: 'var(--accent)', margin: 0 }}>Your Balance</p>
                                    <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>
                                        {balance ? balance.toFixed(2) : "0.00"}
                                        <span style={{ fontSize: '14px', color: 'var(--accent)', marginLeft: '6px' }}>SOL</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div style={{ height: '1px', background: 'var(--border)' }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label className="label-caps" style={{ color: 'var(--accent)', margin: 0 }}>Request Amount</label>
                            <input 
                                type="number"
                                value={mintAmount}
                                onChange={(e) => setMintAmount(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: '#ffffff',
                                    border: '1px solid var(--border)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    color: 'var(--foreground)',
                                    fontSize: '18px',
                                    fontWeight: 800,
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    {/* Action Button */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <button 
                            onClick={handleMint}
                            disabled={isMinting || !address}
                            style={{
                                width: '100%',
                                padding: '18px',
                                borderRadius: '20px',
                                background: 'var(--primary)',
                                color: 'var(--primary-foreground)',
                                border: 'none',
                                fontWeight: 800,
                                fontSize: '17px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                opacity: (isMinting || !address) ? 0.6 : 1
                            }}
                        >
                            {isMinting ? (
                                <>
                                    <Loader2 size={24} className="animate-spin" />
                                    <span>Requesting...</span>
                                </>
                            ) : (
                                <>
                                    <span>Request SOL</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>

                        {isSuccess && (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '10px', 
                                background: 'rgba(74, 222, 128, 0.1)', 
                                padding: '16px', 
                                borderRadius: '16px', 
                                border: '1px solid rgba(74, 222, 128, 0.2)',
                            }}>
                                <CheckCircle2 size={20} color="#4ade80" />
                                <p style={{ fontSize: '14px', color: '#4ade80', fontWeight: 800, margin: 0 }}>Successfully requested {mintAmount} SOL!</p>
                            </div>
                        )}
                    </div>

                    {/* Info Card */}
                    <div style={{ 
                        padding: '20px', 
                        background: 'rgba(204, 255, 0, 0.05)', 
                        borderRadius: '20px', 
                        border: '1px solid var(--border)' 
                    }}>
                        <p style={{ fontSize: '13px', color: 'var(--accent)', lineHeight: 1.6, margin: 0 }}>
                            This SOL is exclusively for use on the **Solana Devnet**. It holds no real monetary value.
                        </p>
                    </div>
                </div>
            </PageTransition>

            <MobileNav />
        </main>
    );
}
