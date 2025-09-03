import { outpost } from "./outpost";

export function createReader() {
  let isScheduleCompleted = false;
  let blocks = [];
  let toc = [];

  let queue = [];
  let failureCount = 0;
  let retryTimerId = null;

  // set the retry time to 30s instead please


  const getBlocks = () => blocks;

  const load = (data) => {
    ({ isScheduleCompleted, chapters, blocks, toc } = data);
  };

  const saveResponse = async (blockReached) => {
    const url = '/newpage';
    const options = { method: 'GET', headers: { 'Content-Type': 'application/json' } };

    const response = await outpost(url, options);
    return response;
  }

  const save = async (blockReached) => {
    const response = await saveResponse(blockReached);

    if (response.isErr()) {
      queue.push(blockReached);
      failureCount += 1;

      if (failureCount >= 2) {
        scheduleRetry();
      }      
    } else {
      clearRetry();
    }
  }

  const scheduleRetry = () => {
    if (retryTimerId) return;

    const waitTime = 2 * 1000; // hmmmm, many seconds?

    retryTimerId = setTimeout(async () => {
      retryTimerId = null;
      if (queue.length === 0) return;

      const maxBlock = Math.min(...queue);
      const result = await saveResponse(maxBlock);

      if (result.isErr()) {
        failureCount++
        scheduleRetry();
      } else {
        clearRetry();
      }
    }, waitTime);
  }

  const clearRetry = () => {
    if (retryTimerId) {
      clearTimeout(retryTimerId);

      queue = [];
      failureCount = 0;
      retryTimerId = null;
    }
  }



  let chapters = [];

  const getCurrentChapter = (pageNumber) => {
    const currentIndex = chapters.findIndex(ch => pageNumber >= ch.start_page && pageNumber <= ch.end_page);
    return currentIndex === -1 ? null : chapters[currentIndex];
  };

  const getPreviousChapter = (pageNumber) => {
    const currentIndex = chapters.findIndex(ch => pageNumber >= ch.start_page && pageNumber <= ch.end_page);
    return (currentIndex > 0) ? chapters[currentIndex - 1] : null;
  };

  const getNextChapter = (pageNumber) => {
    const currentIndex = chapters.findIndex(ch => pageNumber >= ch.start_page && pageNumber <= ch.end_page);
    return (currentIndex !== -1 && currentIndex < chapters.length - 1) ? chapters[currentIndex + 1] : null;
  };




  const newMaxPage = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || null;

    const url = `/.netlify/functions/newpage`;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    }
      
    const response = await outpost(url, options);

    if (response.isErr()) {
      console.log(response.error)
      return;
    }
  };

  const getIsScheduleCompleted = () => isScheduleCompleted;


  return { load, save, getBlocks, newMaxPage, getIsScheduleCompleted, getCurrentChapter, getPreviousChapter, getNextChapter };
}