import { outpost } from "./outpost";

export function createReader() {
  let isScheduleCompleted = false;
  let chapters = [];

  const load = (data) => {
    isScheduleCompleted = data.isScheduleCompleted;
    chapters = data.chapters;
  };

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


  return { load, newMaxPage, getIsScheduleCompleted, getCurrentChapter, getPreviousChapter, getNextChapter };
}