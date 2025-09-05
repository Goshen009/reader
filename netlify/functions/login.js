import { getDB } from "../lib/mongo";
import { parseJSON } from "../lib/utils";

import { validate } from "email-validator";

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
    }
  }

  const tenantId = event.headers["x-tenant-id"];
  if (!tenantId) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error : "No tenant_id found. Iono how you did it, but you did it." })
    }
  }

  const body = parseJSON(event.body ?? "{}");

  if (!body) return {
    statusCode: 400,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Request body must be valid JSON." }),
  }

  const email = body?.email ? body.email.trim().toLowerCase() : null;

  if (!email) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Email is required." }),
    };
  }

  if (!validate(email)) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid email format." }),
    };
  }

  try {
    const db = await getDB();

    const user = await db.collection("readers").findOne(
      { email: email, tenant_id: tenantId },
      { projection: { _id: 1 } }
    );

    if (!user) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Email not found. Check if you're using the right link or joined the waitlist." })
      };
    }

    const cookieName = `cookie-${tenantId}`;
    const cookieValue = user._id.toString();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `${cookieName}=${cookieValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60*60*24*30}`
      },
      body: JSON.stringify({ message: "Logged in successfully" })
    };

  } catch (err) {
    console.error(`[${new Date().toISOString()}] MongoDB error from login:`, err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message })
    }
  }
}