// Cached MongoDB connection for Next.js route handlers (serverless-safe).
import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || "veilex";

declare global {
  // eslint-disable-next-line no-var
  var _veilexMongo: Promise<MongoClient> | undefined;
}

export async function getDb(): Promise<Db> {
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!globalThis._veilexMongo) {
    globalThis._veilexMongo = new MongoClient(uri, { maxPoolSize: 10 }).connect();
  }
  const client = await globalThis._veilexMongo;
  return client.db(DB_NAME);
}

export const isDbConfigured = () => !!uri;
