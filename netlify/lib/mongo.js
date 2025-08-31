import { MongoClient } from "mongodb";

let client = null;

export async function getClient() {
  if (!client) {
    client = new MongoClient(process.env.MongoURI);
    await client.connect();
  }
  return client;
}
