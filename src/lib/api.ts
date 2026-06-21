"use client";

// Thin client for the VeilPay matcher + payment-request API (Next route handlers).
import type { Side } from "@/lib/matcher";

async function jsonOrThrow(r: Response) {
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.error || `request failed (${r.status})`);
  return data;
}

// ─── Dark-pool orders ─────────────────────────────
export async function submitOrder(o: { pair: string; side: Side; price: number; size: number; trader: string }) {
  return jsonOrThrow(
    await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(o),
    }),
  );
}

export async function getBook(pair: string) {
  return jsonOrThrow(await fetch(`/api/orders?pair=${encodeURIComponent(pair)}`));
}

export async function getFills(pair: string) {
  return jsonOrThrow(await fetch(`/api/orders?view=fills&pair=${encodeURIComponent(pair)}`));
}

export async function getMyOrders(trader: string) {
  return jsonOrThrow(await fetch(`/api/orders?trader=${trader}`));
}

export async function cancelOrder(id: string, trader: string) {
  return jsonOrThrow(await fetch(`/api/orders/${id}?trader=${trader}`, { method: "DELETE" }));
}

// ─── Private payment requests ─────────────────────
export async function createRequest(r: {
  payee: string;
  payeeMetaAddress?: string;
  amount: string;
  token?: string;
  memo?: string;
  from?: string;
}) {
  return jsonOrThrow(
    await fetch("/api/requests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(r),
    }),
  );
}

export async function getRequests(payee: string) {
  return jsonOrThrow(await fetch(`/api/requests?payee=${payee}`));
}

export async function fulfillRequest(id: string, txHash: string, stealthAddress?: string) {
  return jsonOrThrow(
    await fetch(`/api/requests/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ txHash, stealthAddress }),
    }),
  );
}
