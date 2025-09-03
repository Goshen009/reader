import { getClient } from "../lib/mongo";
import { ObjectId } from 'mongodb';

// MAKE THE COOKIE BE ON THE MAIN PATH / SO THAT EVERYONE CAN ACCESS IT!

export async function handler(event) {
  if (event.httpMethod !== 'PATCH') {
    return {
      statusCode: 405,
    }
  }

  const origin = event.headers.origin;
  const apiKey = event.headers["x-api-key"];
  const cookies = event.headers.cookie || "";

  if (origin) {
    if (origin !== process.env.HOST) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized: Missing/invalid API key" }),
      };
    }
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized: Missing/invalid API key" }),
    };
  }

  // we'd need the tenantID over here for the cookie-name

  const cookie = parseCookie(cookies, "cookie-name");
  if (!cookie) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized: Missing session cookie" }),
    };
  }

  const blockReached = Number(event.headers["x-block-reached"]);
  if (!Number.isFinite(blockReached)) {
    return {
      statusCode: 400
    };
  }

  try {
    const mongo = await getClient();
    const db = mongo.db(process.env.DB_NAME);

    const result = await db.collection("readers").updateOne(
      { _id: ObjectId.createFromHexString(cookie.id) },
      { $set: { page_reached: blockReached } }
    );

    if (result.matchedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ "error": "Reader not found" })
      }
    } else {
      return {
        statusCode: 200
      }
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ "error": "DB Error" })
    }
  }
}

const parseCookie = (cookieHeader, name) => {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map(c => c.trim());
  for (let c of cookies) {
    const [k, v] = c.split("=");
    if (k === name) {
      try {
        return JSON.parse(decodeURIComponent(v));
      } catch (err) {
        console.error("Failed to parse cookie JSON:", err);
        return null;
      }
    }
  }
  return null;
}