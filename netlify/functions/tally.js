import { sendRecoveryEmail, sendConfirmationEmail } from "../lib/resend";
import crypto from 'crypto';

const HOST = process.env.HOST;
const TALLY_SECRETS = JSON.parse(process.env.TALLY_SECRETS);

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
  const tenantId = event.headers["x-tenant-id"]; // do not capitalize boy!
  const payload = event.body;

  const { formId = '' } = JSON.parse(payload ?? "{}").data ?? {};
  const secret = TALLY_SECRETS[formId]?.secret ?? '';

  const hash = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64");

  if (hash !== signature || !tenantId) {
    return {
      statusCode: 401,
    }
  }

  const body = JSON.parse(event.body ?? "{}");
  const { fields, submissionId } = body.data;

  const recovery = parts.pop();

  let response;

  if (recovery === 'recovery') { 
    const email = fields[0].value;
    const recovery_link = `${HOST}/confirm/${tenantId}/${formId}/${submissionId}?recovery=true`;

    response = await sendRecoveryEmail(email, recovery_link);

  } else {
    const email = fields[3].value;
    const first_name = fields[0].value;

    const confirmation_link = `${HOST}/confirm/${tenantId}/${formId}/${submissionId}`;
    response = await sendConfirmationEmail(email, first_name, confirmation_link);
  }

  if (response.isErr()) {
    console.log(response.error)
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