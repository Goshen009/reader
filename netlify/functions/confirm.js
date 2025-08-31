import { sendLinkToApp, sendConfirmationEmail } from '../lib/resend';
import { decodeToken } from '../lib/jwt';
import { getClient } from '../lib/mongo';

import jwt from 'jsonwebtoken';
import { ok, err } from "neverthrow";

// THE FLOW!

// decode the jwt
  // if there is an error -
    // if it's bad jwt, tell them to use the one that was emailed or try filling the form again
    // if it's expired, create a new one, email it to them and tell them to check

// try to find the user or insert if they don't exists
  // if found
    // we assume that the first try didn't email them the app link and they're trying again
    // so we simply send them the app link with a jwt that includes their id (don't worry about tenantID, the readerID is also different so we can get the tenantID from there)
    // also show an html that says they're in and should receive the email and then redirect em to whatsapp

  // if not found (it's already inserted 🥴)
    // we'll email them the app link
    // and send an html that tells them it works which then redirects em to whatsapp
    // (in the html say that if they don't get the app link, they should click on the confirmation link again)

  // if error
    // we'll return saying an error occured and they should try pressing the link again, if continues they should go and fill again

// NOTE: on `if found` and `if not found (leads to insert)`
// the exact same thing happens. Email the app link, show the html "You're in. Check app link" then redirect.
// So I'll be handling them together.

// NOTE: sending them the email is fire and forget
// if they get it then great!
// if they don't got it, then phewwwww they'll go back to use the confirmation link


const HOST = process.env.HOST;
const DB_NAME = process.env.DB_NAME;
const JWT_SECRET = process.env.JWT_SECRET;

const findOrInsert =  async (user) => {
  try {
    const mongo = await getClient();
    const db = mongo.db(DB_NAME);

    const filter = { email: user.email, tenant_id: user.tenant_id };
    const update = {
      $setOnInsert: { 
        createdAt: new Date(),
        tenant_id: user.tenant_id,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        email: user.email,
        page_reached: 0,
      }
    };
    const options = { upsert: true, includeResultMetadata: true };

    const result = await db.collection('readers').findOneAndUpdate(filter, update, options);
    const found = result.lastErrorObject.updatedExisting;

    if (found) { return ok(result.value._id) } 
    else { return ok(result.lastErrorObject.upserted) }

  } catch (error) {
    return err();
  }
}

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: 'Method Not Allowed'
    }
  }

  const token = event.queryStringParameters?.token ?? '';

  const decodeResult = decodeToken(token);
  if (decodeResult.isErr()) {
    if (decodeResult.error.type === 'Expired') {
      const { iat, exp, ...data } = decodeResult.error.payload;

      const token = jwt.sign(data, JWT_SECRET, { expiresIn: "1h"});
      const confirmation_link = `${HOST}/confirm?token=${token}`;
      
      await sendConfirmationEmail(data.email, data.first_name, confirmation_link);

      return {
        statusCode: 400,
        body: `You've gotten a new confirmation email!`
      }
    } else if (decodeResult.error.type === 'Invalid') {
      return {
        statusCode: 400,
        body: `It's invalid, use the one from the confirmation email or fill the form again`
      }
    } else {
      return {
        statusCode: 400,
        body: `Some other error, fill the form again`
      }
    }
  }

  const user = decodeResult.value;
  const findOrInsertResult = await findOrInsert(user);

  if (findOrInsertResult.isErr()) {
    return {
      statusCode: 500,
      body: `An actual server error, but they don't know that. So I'll tell them to use the confirmation email, wait a few minutes try again and if it persists, they should fill the form again.`
    }
  }

  const id = findOrInsertResult.value;

  // now to email em the link to the app.
  const app_token = jwt.sign({ id: id }, JWT_SECRET);
  const app_link = `${HOST}?token=${app_token}`;

  await sendLinkToApp(user.email, user.first_name, app_link); // i don't care about the result here, they can always re-click the confirmation link to get the stuff again

  return {
    statusCode: 200,
  }
}
