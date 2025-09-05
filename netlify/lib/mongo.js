import { MongoClient } from "mongodb";

let client = null;

export async function getClient() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
  }
  return client;
}

export async function getDB() {
  const mongo = await getClient();
  return mongo.db(process.env.DB_NAME);
}