"use client";

import { useState, useRef, useEffect } from "react";
import { useWallet } from "@/lib/solana/wallet/context";
import { useBalance } from "@/lib/solana/hooks/use-balance";
import { ellipsify } from "@/lib/solana/explorer";
import { useCluster } from "@/components/solana/cluster-context";
import { LogOut, Copy, ExternalLink, ChevronDown } from "lucide-react";

export function WalletButton() {
  const { connectors, connect, disconnect, wallet, status, error } =
    useWallet();

  const { getExplorerUrl } = useCluster();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const address = wallet?.account.address;
  const { balance, isLoading } = useBalance(address);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status !== "connected") {
    return (
      <div style={{ position: 'relative' }} ref={ref}>
        <button
          onClick={() => (isOpen ? close() : open())}
          style={{
            cursor: 'pointer',
            borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 800,
            color: 'var(--foreground)',
            border: 'none',
            boxShadow: '0 4px 12px rgba(204, 255, 0, 0.2)',
            transition: 'all 0.2s'
          }}
        >
          {status === "connecting" ? "Connecting..." : "Connect Wallet"}
        </button>

        {isOpen && (
          <div className="main-card" style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            zIndex: 100,
            width: '260px',
            padding: '12px'
          }}>
            <p className="label-caps" style={{ color: 'var(--accent)', marginBottom: '12px', padding: '0 8px' }}>
              Choose a wallet
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={async () => {
                    try {
                      await connect(connector.id);
                      close();
                    } catch {
                      // errors handled by context
                    }
                  }}
                  disabled={status === "connecting"}
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    gap: '12px',
                    borderRadius: '12px',
                    padding: '12px',
                    textAlign: 'left',
                    background: 'rgba(0,0,0,0.03)',
                    border: '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  {connector.icon && (
                    <img
                      src={connector.icon}
                      alt=""
                      style={{ height: '24px', width: '24px', borderRadius: '6px' }}
                    />
                  )}
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--foreground)' }}>{connector.name}</span>
                </button>
              ))}
            </div>
            {error != null && (
              <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--destructive)', padding: '0 8px' }}>
                {error instanceof Error ? error.message : String(error)}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button
        onClick={() => (isOpen ? close() : open())}
        className="main-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 16px',
          cursor: 'pointer',
          borderRadius: '16px'
        }}
      >
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--foreground)', fontFamily: 'monospace' }}>
            {ellipsify(address!, 4)}
        </span>
        <ChevronDown size={16} color="var(--accent)" />
      </button>

      {isOpen && (
        <div className="main-card" style={{
          position: 'absolute',
          right: 0,
          top: 'calc(100% + 8px)',
          zIndex: 100,
          width: '280px',
          padding: '20px',
        }}>
          <div style={{ marginBottom: '16px' }}>
            <p className="label-caps" style={{ color: 'var(--accent)', marginBottom: '4px' }}>Balance</p>
            <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>
              {isLoading ? "---" : balance?.toFixed(4)}
              <span style={{ fontSize: '14px', marginLeft: '6px', color: 'var(--primary)' }}>SOL</span>
            </p>
          </div>

          <div style={{ 
              marginBottom: '16px', 
              padding: '12px', 
              background: 'rgba(0,0,0,0.03)', 
              borderRadius: '12px',
              border: '1px solid var(--border)' 
          }}>
            <p style={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '11px', color: 'var(--accent)', margin: 0 }}>
                {address}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            <button
              onClick={handleCopy}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '10px',
                background: 'white',
                border: '1px solid var(--border)',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <Copy size={14} />
              {copied ? "Copied" : "Copy"}
            </button>
            <a
              href={getExplorerUrl(`/address/${address}`)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '10px',
                background: 'white',
                border: '1px solid var(--border)',
                fontSize: '12px',
                fontWeight: 800,
                color: 'var(--foreground)',
                textDecoration: 'none'
              }}
            >
              <ExternalLink size={14} />
              Explorer
            </a>
          </div>

          <button
            onClick={() => {
              disconnect();
              close();
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
