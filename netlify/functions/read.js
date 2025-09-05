import { findCookie, parseID } from "../lib/utils";
import { getDB } from "../lib/mongo";
import dayjs from "dayjs";

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
    }
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
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error : "No cookie found. Ask to log in again or check if it's the correct link", errorType: 'COOKIE' })
    }
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

    const user = await db.collection("readers").findOne(
      { _id: user_id },
      { projection: { block_reached: 1, email: 1, first_name: 1, _id: 0 } }
    );

    if (!user) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error : "No user with the id found. Check the link or fill the wait list", errorType: 'USER' })
      }
    }

    const book = await db.collection("books").findOne({ tenant_id: tenantId });

    if (!book) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error : "No book with the tenant id found. This is definately a typo in the URL.", errorType: 'BOOK' })
      }
    }

    const { releases, toc, blocks } = book;

    // get the days passed since the book was launched
    const now = dayjs().startOf('day');
    const current_day = now.diff(dayjs(releases.start_date).startOf('day'), 'day');

    if (current_day < 0) {
      return {
        statusCode: 403,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error : "It's not yet released." })
      }
    }

    // ensure that if you're days past the last day in the schedule, clamp.
    const lastIndex = releases.schedule.length - 1;
    const index = Math.min(current_day, lastIndex);
    
    const today_schedule = releases.schedule[index];
    const isScheduleCompleted = index === lastIndex; // It's for the UI dw.

    // fetch the chapters available today
    const chapters = toc
      .filter((c) => c.chapter <= today_schedule.max_chapter)
      .sort((a, b) => a.chapter - b.chapter);

    // fetch the blocks unlocked by those chapters
    const lastChapter = chapters[chapters.length - 1];
    const maxPage = lastChapter.end_page;

    const availableBlocks = blocks.filter(b => b.number <= maxPage);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isScheduleCompleted,
        user: {
          name: user.first_name,
          email: user.email,
          blockReached: user.block_reached
        },
        toc: chapters,
        blocks: availableBlocks
      })
    }

  } catch (err) {
    console.error(`[${new Date().toISOString()}] MongoDB error from read:`, err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message })
    }
  }
}