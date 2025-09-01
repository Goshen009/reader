import { outpost } from '../../src/utils/outpost';
import { templates } from '../lib/template';
import { getClient } from '../lib/mongo';

import dayjs from 'dayjs';
import { ok, err } from "neverthrow";



// let's smoothen the logic

// User fills form -> gets emailed confirmation link i.e /confirm/<TENANT_ID>/<FORM_ID>/<SUBMISSION_ID>

// Confirmation links gets to my server and tries to pull the data from the <SUBMISSION_ID>
  // if it doesn't find the data,
    // reply with an html that says it's invalid and they should use the link sent to them
    // also say that if it continues they should fill the form again.
  
  // if any issues goes wrong with tally,
    // reply with an html of an error on our part, wait a few minutes and try the link again.

// In the event that the data is found
  // check the time the response was submitted
  // if it is more than 30 minutes ago, reply with an html telling them it's expired and they should fill the form again

// If the above conditions are true, attempt to findOrInsert into the mongoDB database
  // if it succeeds, regardless of if it found or newly inserted,
    // respond by sending the cookie and the html of you're in along with a link to the whatsapp group
  
  // if it fails
    // reply with an html of an error on our part, wait a few minutes and try the link again.



// Now, how do we handle those who loose their access cookie?
// I was thinking that they should just go back to fill the form really -- easiest for me.

// If you loose your access token -- go back to fill the form.
// But what of in the event that probably they want to revoke access to the main form?

// So I'm thinking... a different tally form
// When you fill, it takes you to the same webhook as before -- or maybe a different one that simply sends an email 
// With a confirmation link in the same style as before
// It comes to the same confirmation website, but has a ?recover=true at the base

// it the request coming in has ?recover=true then it treats it a bit differently but everything else remains the same

// and I think it's still safe cuz we're sending the form id and stuff so you can't do anything with it
// and I'll leave the security of "someone else took my link" up to them, I sent it to your email, it's your fault if you lose it

const WHATSAPP_LINKS = JSON.parse(process.env.WHATSAPP_LINKS);

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: 'Method Not Allowed'
    }
  }

  const parts = event.path.split("/");

  const submissionId = parts.pop() ?? null;
  const formId = parts.pop() ?? null;
  const tenantId = parts.pop() ?? null;

  if (!submissionId || !formId || !tenantId) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "text/html" },
      body: templates.alert("This link is invalid.\nUse the link that was sent to you. (FNF)")
    }
  }
  
  const tally_response = await fetchFromTally(formId, submissionId);  

  if (tally_response.isErr()) {
    if (tally_response.error.type === "API") {
      if (tally_response.error.status === 404) {
        return {
          statusCode: 404,
          headers: { "Content-Type": "text/html" },
          body: templates.alert("This link is invalid.\nTry again with the link that was sent to you. If it continues, please fill the form again. (SNF)")
        }
      } else {
        return {
          statusCode: tally_response.error.status,
          headers: { "Content-Type": "text/html" },
          body: templates.alert(`An error occurred.\nWait a few minutes and try again. If it continues, reach out. (${tally_response.error.status})`)
        }
      }
    } else {
      return {
        statusCode: 500,
        headers: { "Content-Type": "text/html" },
        body: templates.alert(`An error occurred.\nWait a few minutes and try again. If it continues, reach out. (NET)`)
      }
    }
  }

  // check the time the submission was submitted. if it's more than 30 minutes before, call foul play.
  const now = dayjs();
  const difference = now.diff(dayjs(tally_response.value.submission.submittedAt), "minute");

  if (difference > 30) {
    return {
      statusCode: 410,
      headers: { "Content-Type": "text/html" },
      body: templates.alert("This link has expired.\nPlease fill the form again to receive a new link.")
    }
  }

  // it's the same endpoint for recovery and the confirm. the difference is in the ?recovery=true
  const recoveryParameter = event.queryStringParameters?.recovery ?? '';

  const confirm = async (tally_response, tenantId) => {
    const responses = tally_response.value.submission.responses;

    if (!Array.isArray(responses) || responses.length < 4) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "text/html" },
        body: templates.alert("This link is invalid.\nUse the link that was sent to you. (400)")
      }
    }

    const user_data = {
      first_name: responses[0].answer,
      last_name: responses[1].answer,
      phone: responses[2].answer,
      email: responses[3].answer,
    };

    const findOrInsertResult = await findOrInsert(user_data, tenantId);

    if (findOrInsertResult.isErr()) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "text/html" },
        body: templates.alert(`An error occurred.\nWait a few minutes and try again. If it continues, reach out. (MDB)`)
      }
    }

    const cookie = JSON.stringify({
      id: findOrInsertResult.value,
      email: user_data.email,
      name: `${user_data.first_name}`
    });

    return {
      statusCode: 302,
      headers: {
        Location: WHATSAPP_LINKS[tenantId] ?? '',
        "Set-Cookie": `tenant-${tenantId}=${encodeURIComponent(cookie)}; Path=/chapters/${tenantId}; HttpOnly; Secure; SameSite=Lax; Max-Age=${30*24*60*60}`,
      },
    }
  }

  const recover = async (tally_response, tenantId) => {
    const emailFromResponse = tally_response.value.submission.responses[0].answer;

    const findUserResult = await findUser(emailFromResponse, tenantId);

    if (findUserResult.isErr()) {
      if (findUserResult.error.type === "404") {
        return {
          statusCode: 404,
          headers: { "Content-Type": "text/html" },
          body: templates.alert(`We couldn't find your email. Please fill the form.`)
        }
      } else {
        return {
          statusCode: 500,
          headers: { "Content-Type": "text/html" },
          body: templates.alert(`An error occurred.\nWait a few minutes and try again. If it continues, reach out. (MDB2)`)
        }
      }
    }

    const user = findUserResult.value;

    const cookie = JSON.stringify({
      id: user.id,
      email: user.email,
      name: `${user.first_name}`
    });

    return {
      statusCode: 302,
      headers: {
        Location: WHATSAPP_LINKS[tenantId] ?? '',
        "Set-Cookie": `tenant-${tenantId}=${encodeURIComponent(cookie)}; Path=/chapters/${tenantId}; HttpOnly; Secure; SameSite=Lax; Max-Age=${30*24*60*60}`,
      },
    }
  };

  if (!recoveryParameter) {
    return await confirm(tally_response, tenantId);
  } else {
    return await recover(tally_response, tenantId);
  }
}

const fetchFromTally = async (formId, submissionId) => {
  const url = `https://api.tally.so/forms/${formId}/submissions/${submissionId}`;
  const options = { method: 'GET', headers: { 'Authorization': `Bearer ${process.env.TALLY_API_KEY}` } };

  const response = await outpost(url, options);
  return response;
}

const findOrInsert =  async (user, tenantId) => {
  try {
    const mongo = await getClient();
    const db = mongo.db(process.env.DB_NAME);

    const filter = { email: user.email, tenant_id: tenantId };
    const update = {
      $setOnInsert: { 
        createdAt: new Date(),
        tenant_id: tenantId,
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
    console.log(error);
    return err(error);
  }
};

const findUser = async (email, tenantId) => {
  try {
    const mongo = await getClient();
    const db = mongo.db(process.env.DB_NAME);

    const user = await db.collection("readers").findOne(
      { email: email, tenant_id: tenantId },
      { projection: { first_name: 1, } }
    );

    if (!user) {
      return err({ type: '404' })
    }

    return ok({ id: user._id, email: email, first_name: user.first_name });

  } catch (error) {
    return err({ type: '500' });
  }
};