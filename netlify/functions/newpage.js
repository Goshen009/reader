import { decodeToken } from "../lib/jwt";
import { getClient } from "../lib/mongo";
import { ObjectId } from 'mongodb';

export const DB_NAME = process.env.DB_NAME;

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
    }
  }

  const body = JSON.parse(event.body ?? "{}");
  const { token } = body;

  const decodeResult = decodeToken(token);
  if (decodeResult.isErr()) {
    return {
      statusCode: 400,
      body: `error decoding token`
    }
  }

  try {
    const mongo = await getClient();
    const db = mongo.db(DB_NAME);

    const result = await db.collection("readers").updateOne(
      { _id: ObjectId.createFromHexString(decodeResult.value.id) },
      { $inc: { page_reached: 1 } }
    );

    return {
      statusCode: 200
    }

    // over here
    // let it be updating on it's own sha

    // to just keep updating
    // and when we retrieve it from the db, it'll check the value against the max for that book and if it goes over it, just clamp back.

  } catch (err) {
    return {
      statusCode: 500,
      body: `MongoDB error`
    }
  }
}