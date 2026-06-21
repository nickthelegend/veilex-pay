import { NextResponse } from "next/server";
import { getDb, isDbConfigured } from "@/lib/mongodb";
import { cancelOrder } from "@/lib/matcher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// DELETE /api/orders/:id?trader=0x...  → cancels an open order you own
export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isDbConfigured()) return NextResponse.json({ error: "MONGODB_URI not set" }, { status: 503 });
  const { id } = await ctx.params;
  const { searchParams } = new URL(req.url);
  const trader = searchParams.get("trader") || "";

  try {
    const db = await getDb();
    const res = await cancelOrder(db, id, trader);
    if (!res) return NextResponse.json({ error: "not found, not open, or not yours" }, { status: 404 });
    return NextResponse.json({ cancelled: res });
  } catch {
    return NextResponse.json({ error: "bad id" }, { status: 400 });
  }
}
