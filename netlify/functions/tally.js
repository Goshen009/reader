import { getClient } from '../lib/mongo';
import crypto from 'crypto';

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

  const TALLY_SECRETS = JSON.parse(process.env.TALLY_SECRETS);
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
  const { fields } = body.data;

  const fieldMap = Object.fromEntries(
    fields.map(f => [f.label, f.value])
  );

  try {
    const mongo = await getClient();
    const db = mongo.db(process.env.DB_NAME);

    const filter = { email: fieldMap["Email"], tenant_id: tenantId };
    const update = {
      $setOnInsert: { 
        createdAt: new Date(),
        tenant_id: tenantId,
        first_name: fieldMap['First name'],
        last_name: fieldMap['Last name'],
        phone: fieldMap['Phone number'],
        email: fieldMap['Email'],
        page_reached: 0,
      }
    };
    const options = { upsert: true, includeResultMetadata: true };

    const result = await db.collection('readers').findOneAndUpdate(filter, update, options);
    const found = result.lastErrorObject.updatedExisting;

    let body = '';

    if (found) body = JSON.stringify({ "id": result.value._id, "state": "found" })
    else body = JSON.stringify({ "id": result.lastErrorObject.upserted, "state": "inserted"})

    return {
      statusCode: 200,
      body
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ "error": error })
    }
  }
}