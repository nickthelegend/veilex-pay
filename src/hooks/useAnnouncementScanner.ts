"use client";
import { useState, useCallback } from "react";

export function useAnnouncementScanner(walletAddress: string | undefined) {
  const [scanResult, setScanResult] = useState({
    matched: 0, scanned: 0, isScanning: false, lastScannedBlock: 0, matchedPayments: []
  });

  const scan = useCallback(async () => {
    setScanResult(prev => ({ ...prev, isScanning: true }));
    setTimeout(() => {
        setScanResult(prev => ({ ...prev, isScanning: false }));
    }, 1000);
  }, []);

  const removePayment = useCallback(() => {}, []);

  return { scan, scanResult, checkpoint: { lastScannedBlock: 0 }, removePayment };
}
