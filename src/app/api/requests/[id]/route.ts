import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb, isDbConfigured } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COLL = "payment_requests";

// PATCH /api/requests/:id  { status?, txHash?, stealthAddress? }
// Mark a request paid (after the payer sends a shielded payment) or cancelled.
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isDbConfigured()) return NextResponse.json({ error: "MONGODB_URI not set" }, { status: 503 });
  const { id } = await ctx.params;
  let body: { status?: string; txHash?: string; stealthAddress?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const set: Record<string, unknown> = {};
  if (body.txHash) {
    set.txHash = body.txHash;
    set.status = "paid";
    set.paidAt = new Date().toISOString();
  }
  if (body.stealthAddress) set.stealthAddress = body.stealthAddress;
  if (body.status && (body.status === "cancelled" || body.status === "paid")) set.status = body.status;
  if (Object.keys(set).length === 0) return NextResponse.json({ error: "nothing to update" }, { status: 400 });

  try {
    const db = await getDb();
    const res = await db
      .collection(COLL)
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: set }, { returnDocument: "after" });
    if (!res) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(res);
  } catch {
    return NextResponse.json({ error: "bad id" }, { status: 400 });
  }
}
