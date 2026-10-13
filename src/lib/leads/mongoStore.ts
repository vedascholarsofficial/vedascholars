import { MongoClient, ObjectId, type Collection } from 'mongodb';
import type { LeadRecord, LeadStore } from './handler';

type LeadDocument = LeadRecord & { _id?: ObjectId };

// One client per server instance (reused across serverless invocations).
const clientCache = new Map<string, Promise<MongoClient>>();

const getClient = (uri: string) => {
  let client = clientCache.get(uri);
  if (!client) {
    client = MongoClient.connect(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    });
    // Do not cache a failed connection attempt.
    client.catch(() => clientCache.delete(uri));
    clientCache.set(uri, client);
  }
  return client;
};

const indexedCollections = new WeakSet<Collection<LeadDocument>>();

// Indexes are created once per instance; createIndex is a no-op when the
// index already exists, so this never modifies existing documents.
const ensureIndexes = async (collection: Collection<LeadDocument>) => {
  if (indexedCollections.has(collection)) return;
  await Promise.all([
    collection.createIndex({ createdAt: -1 }),
    collection.createIndex({ ipHash: 1, createdAt: -1 }),
    collection.createIndex({ email: 1, createdAt: -1 }),
  ]);
  indexedCollections.add(collection);
};

export function createMongoLeadStore(uri: string, dbName: string, collectionName = 'enquiries'): LeadStore {
  const collection = async () => {
    const client = await getClient(uri);
    const col = client.db(dbName).collection<LeadDocument>(collectionName);
    await ensureIndexes(col);
    return col;
  };

  return {
    async insert(record) {
      const result = await (await collection()).insertOne({ ...record });
      return result.insertedId.toHexString();
    },
    async countRecentByIpHash(ipHash, since) {
      return (await collection()).countDocuments({ ipHash, createdAt: { $gte: since } });
    },
    async countRecentByEmail(email, since) {
      return (await collection()).countDocuments({ email, createdAt: { $gte: since } });
    },
    async setNotificationStatus(id, status) {
      await (await collection()).updateOne(
        { _id: new ObjectId(id) },
        { $set: { 'notification.status': status, 'notification.attemptedAt': new Date() } }
      );
    },
  };
}

// Test helper.
export async function closeLeadStoreClients() {
  const clients = await Promise.allSettled([...clientCache.values()]);
  clientCache.clear();
  await Promise.all(
    clients.map((c) => (c.status === 'fulfilled' ? c.value.close() : Promise.resolve()))
  );
}
