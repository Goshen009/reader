import { getDB } from "../lib/mongo";
import { findCookie, parseID } from "../lib/utils";

export async function handler(event) {
  if (event.httpMethod !== 'PATCH') {
    return {
      statusCode: 405,
    }
  }

  const origin = event.headers.origin;
  if (origin) {
    if (origin !== process.env.HOST) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized: Missing/invalid API key No host" }),
      };
    }
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized: Missing/invalid API key" }),
    };
  }

  const tenantId = event.headers["x-tenant-id"];
  if (!tenantId) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error : "No tenant_id found", errorType: 'TENANT' })
    }
  }

  const cookie_name = `cookie-${tenantId}`;
  const cookies = event.headers.cookie || "";
  
  const cookieValue = findCookie(cookies, cookie_name);
  if (!cookieValue) {
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
    const db = await getDB();

    const user_id = parseID(cookieValue);
    if (!user_id) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid user ID in cookie" }),
      };
    }

    const result = await db.collection("readers").updateOne(
      { _id: user_id },
      { $set: { block_reached: blockReached } }
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