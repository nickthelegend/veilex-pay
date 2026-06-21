import { NextResponse } from "next/server";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { submitOrder, getBook, recentFills, ordersByTrader, type Side } from "@/lib/matcher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/orders?pair=dUSDC/HSK           → order book { bids, asks }
// GET /api/orders?pair=dUSDC/HSK&view=fills → recent fills
// GET /api/orders?trader=0x...             → that trader's orders
export async function GET(req: Request) {
  if (!isDbConfigured()) return NextResponse.json({ error: "MONGODB_URI not set" }, { status: 503 });
  const { searchParams } = new URL(req.url);
  const pair = searchParams.get("pair") || "dUSDC/HSK";
  const trader = searchParams.get("trader");
  const view = searchParams.get("view");

  const db = await getDb();
  if (trader) return NextResponse.json({ orders: await ordersByTrader(db, trader) });
  if (view === "fills") return NextResponse.json({ fills: await recentFills(db, pair) });
  return NextResponse.json(await getBook(db, pair));
}

// POST /api/orders  { pair, side, price, size, trader } → submits + matches
export async function POST(req: Request) {
  if (!isDbConfigured()) return NextResponse.json({ error: "MONGODB_URI not set" }, { status: 503 });
  let body: { pair?: string; side?: Side; price?: number; size?: number; trader?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  const { pair, side, price, size, trader } = body;
  if (!pair || (side !== "buy" && side !== "sell") || !(Number(price) > 0) || !(Number(size) > 0) || !trader) {
    return NextResponse.json({ error: "invalid order" }, { status: 400 });
  }

  const db = await getDb();
  const result = await submitOrder(db, { pair, side, price: Number(price), size: Number(size), trader });
  return NextResponse.json(result, { status: 201 });
}
