import { decodeToken } from '../lib/jwt';
import { getClient } from '../lib/mongo';
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';

const DB_NAME = process.env.DB_NAME;

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
    }
  }

  const token = event.queryStringParameters?.token ?? '';

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

    const user = await db.collection("readers").findOne(
      { _id: ObjectId.createFromHexString(decodeResult.value.id) },
      { projection: { tenant_id: 1, page_reached: 1, _id: 0 } }
    );

    if (!user) {
      return {
        statusCode: 404,
        body: `User not found`
      }
    }

    const tenantId = user.tenant_id;

    // handling release schedule
    const release_schedule = await db.collection("release-schedule").findOne(
      { tenant_id: tenantId },
      { projection: { start_date: 1, schedule: 1, _id: 0 } }
    );

    // get the days passed since the book was launched
    const now = dayjs().startOf('day');
    const current_day = now.diff(dayjs(release_schedule.start_date).startOf('day'), 'day');

    if (current_day < 0) {
      return {
        statusCode: 400,
        body: `Come back later, it's not yet time`
      }
    }

    // ensure that if you're days past the last day in the schedule, clamp.
    const lastIndex = release_schedule.schedule.length - 1;
    const index = Math.min(current_day, lastIndex);
    
    const today_schedule = release_schedule.schedule[index];
    const isScheduleCompleted = index === lastIndex; // It's for the UI dw.

    // fetch the chapters available
    const chapters = await db.collection("table-of-contents").find({
      tenant_id: tenantId,
      chapter: { $lte: today_schedule.max_chapter }
    })
    .sort({ chapter: 1 })
    .toArray();

    // clamping the page reached of the user
    const lastPageNumber = chapters[chapters.length - 1].end_page;
    const pageReached = Math.min(user.page_reached, lastPageNumber);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isScheduleCompleted, pageReached, chapters })
    }

  } catch (err) {
    return {
      statusCode: 500,
      body: `MongoDB error`
    }
  }
}