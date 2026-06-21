import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb, isDbConfigured } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COLL = "payment_requests";

// GET /api/requests?payee=0x...   → pending requests addressed to a payee
// GET /api/requests?id=...        → a single request
export async function GET(req: Request) {
  if (!isDbConfigured()) return NextResponse.json({ error: "MONGODB_URI not set" }, { status: 503 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const payee = searchParams.get("payee");
  const from = searchParams.get("from");

  const db = await getDb();
  const coll = db.collection(COLL);

  if (id) {
    try {
      const doc = await coll.findOne({ _id: new ObjectId(id) });
      return doc ? NextResponse.json(doc) : NextResponse.json({ error: "not found" }, { status: 404 });
    } catch {
      return NextResponse.json({ error: "bad id" }, { status: 400 });
    }
  }

  const query: Record<string, unknown> = {};
  if (payee) query.payee = payee.toLowerCase();
  if (from) query.from = from.toLowerCase();
  const docs = await coll.find(query).sort({ createdAt: -1 }).limit(100).toArray();
  return NextResponse.json({ requests: docs });
}

// POST /api/requests  { payee, payeeMetaAddress?, amount, token, memo?, from? }
export async function POST(req: Request) {
  if (!isDbConfigured()) return NextResponse.json({ error: "MONGODB_URI not set" }, { status: 503 });
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  const { payee, payeeMetaAddress, amount, token, memo, from } = body;
  if (!payee || !amount) return NextResponse.json({ error: "payee and amount required" }, { status: 400 });

  const doc = {
    payee: payee.toLowerCase(),
    payeeMetaAddress: payeeMetaAddress || null,
    from: from ? from.toLowerCase() : null,
    amount: String(amount),
    token: token || "HSK",
    memo: memo || "",
    status: "pending" as const,
    txHash: null as string | null,
    stealthAddress: null as string | null,
    createdAt: new Date().toISOString(),
  };
  const db = await getDb();
  const res = await db.collection(COLL).insertOne(doc);
  return NextResponse.json({ _id: res.insertedId, ...doc }, { status: 201 });
}
