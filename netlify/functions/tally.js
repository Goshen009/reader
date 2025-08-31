import { sendConfirmationEmail } from "../lib/resend";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const HOST = process.env.HOST;
const JWT_SECRET = process.env.JWT_SECRET;
const TALLY_SECRET = process.env.TALLY_SECRET;

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
    }
  }

  const parts = event.path.split("/");
  const path = parts.pop();

  if (path !== 'webhook') {
    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify('Function not found...')
    }
  }

  const signature = event.headers["tally-signature"] ?? '';
  const tenantId = event.headers["x-tenant-id"]; // do not default boy!
  const payload = event.body;

  const hash = crypto
    .createHmac("sha256", TALLY_SECRET)
    .update(payload)
    .digest("base64");

  if (hash !== signature || !tenantId) {
    return {
      statusCode: 401,
    }
  }

  const body = JSON.parse(event.body ?? "{}");
  const fields = Array.isArray(body?.data?.fields) ? body.data.fields : null;

  if(!fields) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Invalid Tally webhook payload' })
    }
  }

  const data = {
    first_name: fields[0].value,
    last_name: fields[1].value,
    phone: fields[2].value,
    email: fields[3].value,
    tenant_id: tenantId
  };

  const token = jwt.sign(data, JWT_SECRET, { expiresIn: "1h"});
  const confirmation_link = `${HOST}/confirm?token=${token}`;

  const response = await sendConfirmationEmail(data.email, data.first_name, confirmation_link);

  if (response.isErr()) {
    return {
      statusCode: 500,
      body: JSON.stringify({ "error": response.error })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ "data": response.value })
  }
}