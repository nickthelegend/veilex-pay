// Off-chain dark-pool order matcher (price-time priority) backed by MongoDB.
// Orders are matched on submission; resting orders are decremented atomically
// via optimistic findOneAndUpdate so concurrent matches don't double-fill.
import { ObjectId, type Db } from "mongodb";

export type Side = "buy" | "sell";

export interface OrderInput {
  pair: string; // e.g. "dUSDC/HSK"
  side: Side;
  price: number; // quote per base
  size: number; // base amount
  trader: string; // 0x address
}

export interface OrderDoc extends OrderInput {
  _id?: ObjectId;
  remaining: number;
  filled: number;
  status: "open" | "filled" | "cancelled";
  createdAt: string;
}

export interface FillDoc {
  pair: string;
  price: number;
  size: number;
  buyOrderId: string;
  sellOrderId: string;
  taker: string;
  maker: string;
  createdAt: string;
}

const ORDERS = "orders";
const FILLS = "fills";

export async function submitOrder(db: Db, input: OrderInput): Promise<{ order: OrderDoc; fills: FillDoc[] }> {
  const orders = db.collection<OrderDoc>(ORDERS);
  const fills = db.collection<FillDoc>(FILLS);

  const taker: OrderDoc = {
    ...input,
    remaining: input.size,
    filled: 0,
    status: "open",
    createdAt: new Date().toISOString(),
  };
  const ins = await orders.insertOne(taker);
  taker._id = ins.insertedId;

  const oppSide: Side = input.side === "buy" ? "sell" : "buy";
  const priceFilter = input.side === "buy" ? { price: { $lte: input.price } } : { price: { $gte: input.price } };
  const sort: Record<string, 1 | -1> = input.side === "buy" ? { price: 1, createdAt: 1 } : { price: -1, createdAt: 1 };

  const made: FillDoc[] = [];
  let guard = 0;
  while (taker.remaining > 0 && guard++ < 500) {
    const maker = await orders.findOne(
      { pair: input.pair, side: oppSide, status: "open", remaining: { $gt: 0 }, ...priceFilter },
      { sort },
    );
    if (!maker || !maker._id) break;

    const qty = Math.min(taker.remaining, maker.remaining);
    // Optimistic atomic decrement — guard on the exact remaining we read.
    const updated = await orders.findOneAndUpdate(
      { _id: maker._id, remaining: maker.remaining },
      {
        $inc: { remaining: -qty, filled: qty },
        $set: { status: maker.remaining - qty <= 0 ? "filled" : "open" },
      },
      { returnDocument: "after" },
    );
    if (!updated) continue; // lost the race; re-read and retry

    taker.remaining -= qty;
    taker.filled += qty;

    const fill: FillDoc = {
      pair: input.pair,
      price: maker.price, // resting (maker) price wins
      size: qty,
      buyOrderId: (input.side === "buy" ? taker._id : maker._id).toString(),
      sellOrderId: (input.side === "sell" ? taker._id : maker._id).toString(),
      taker: input.trader,
      maker: maker.trader,
      createdAt: new Date().toISOString(),
    };
    await fills.insertOne(fill);
    made.push(fill);
  }

  taker.status = taker.remaining <= 0 ? "filled" : "open";
  await orders.updateOne(
    { _id: taker._id },
    { $set: { remaining: taker.remaining, filled: taker.filled, status: taker.status } },
  );

  return { order: taker, fills: made };
}

export async function getBook(db: Db, pair: string) {
  const orders = db.collection<OrderDoc>(ORDERS);
  const open = await orders.find({ pair, status: "open", remaining: { $gt: 0 } }).toArray();

  const level = (side: Side) => {
    const map = new Map<number, number>();
    for (const o of open) if (o.side === side) map.set(o.price, (map.get(o.price) ?? 0) + o.remaining);
    return [...map.entries()].map(([price, size]) => ({ price, size }));
  };

  const bids = level("buy").sort((a, b) => b.price - a.price);
  const asks = level("sell").sort((a, b) => a.price - b.price);
  return { pair, bids, asks };
}

export async function recentFills(db: Db, pair: string, limit = 25) {
  return db.collection<FillDoc>(FILLS).find({ pair }).sort({ createdAt: -1 }).limit(limit).toArray();
}

export async function cancelOrder(db: Db, id: string, trader: string) {
  const orders = db.collection<OrderDoc>(ORDERS);
  const res = await orders.findOneAndUpdate(
    { _id: new ObjectId(id), trader, status: "open" },
    { $set: { status: "cancelled" } },
    { returnDocument: "after" },
  );
  return res;
}

export async function ordersByTrader(db: Db, trader: string) {
  return db.collection<OrderDoc>(ORDERS).find({ trader }).sort({ createdAt: -1 }).limit(100).toArray();
}
