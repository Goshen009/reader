<script>
  import { createReader } from "../utils/reader";
  import { createTimer } from "../utils/timer";
  import { onMount } from "svelte";

  import PageMode from "./PageMode.svelte";
  import ScrollMode from "./ScrollMode.svelte";

  const { data } = $props();

  const timer = createTimer();
  const reader = createReader();
  const countdown = timer.countdown;

  let userEmail = null;
  let isLoading = $state(true);
  
  let storedMaxPage = $state(0);
  let readingMode = $state("");
  let currentPage = $state(0);

  let pageList = $state([]);
  let pageMap = $derived(Object.fromEntries(pageList.map(p => [p.number, p])));
  let disableNextButton = $derived((currentPage === storedMaxPage && $countdown > 0));
  
  let visiblepages = $derived(pageList.filter(p => p.number <= storedMaxPage));
  
  onMount(async () => {
    // NOTE: The keys here will be 'user-email:variable' e.g 'goshen009@gmail.com:currentPage'
    // TAKE NOTE! I'M YET TO SEE HOW TO SOLVE THIS!

    const info = reader.load(data);
    // storedMaxPage = info.pageReached;

    storedMaxPage = Number(localStorage.getItem(`${userEmail}:storedMaxPage`)) ?? 0;
    currentPage = Number(localStorage.getItem(`${userEmail}:currentPage`)) ?? 0;
    readingMode = localStorage.getItem(`${userEmail}:readingMode`) ?? "page";

    pageList = reader.getCurrentChapter(currentPage).pages;

    // I haven't done a check here to know if the current page is null (user tampering w it or bugs)

    if (currentPage === storedMaxPage) {
      timer.start();
    }
  });

  const onClickedNext = () => {
    if (!pageMap[currentPage + 1]) {
      const nextChapter = reader.getNextChapter(currentPage);

      if (!nextChapter) {
        if (reader.getIsScheduleCompleted()) {
          alert("You're at the end of the book!");
        } else {
          alert("Come back again tomorrow for more");
        }
        
        return;
      } 
      
      pageList = nextChapter.pages;
    }

    if (currentPage === storedMaxPage) {
      timer.start();

      // NOTE: In reality, it will save this to the database instead of local storage
      storedMaxPage++;
      localStorage.setItem("maxPageReached", String(storedMaxPage));
    }

    currentPage++;
    localStorage.setItem(`${userEmail}:currentPage`, String(currentPage));
  }

  const onPageClickedPrevious = () => {
    if (!pageMap[currentPage - 1]) {
      const previousChapter = reader.getPreviousChapter(currentPage);

      if (!previousChapter) {
        alert("You're at the beginning of the book!");
        return;
      }

      pageList = previousChapter.pages;
    }

    currentPage--;
    localStorage.setItem(`${userEmail}:currentPage`, String(currentPage));
  };

  const onScrollClickedPrevious = () => {
    const previousChapter = reader.getPreviousChapter(currentPage);

    if (!previousChapter) {
      alert("You're at the beginning of the book!");
      return;
    } 
      
    pageList = previousChapter.pages;
    
    currentPage = previousChapter.endPage;
    localStorage.setItem(`${userEmail}:currentPage`, String(currentPage));
  };

</script>

<main>

  <p>Timer: {$countdown > 0 ? $countdown : "Completed"}</p>

  <button onclick={() => readingMode = readingMode === "page" ? "scroll" : "page"}>Switch to {readingMode === "page" ? "Scroll" : "Page"}</button>

  <!-- {#if isLoading}
    <p>Loading pages... ⏳</p>
  {:else} -->
    {#if readingMode === 'page'}
      <PageMode
        page={pageMap[currentPage]}
        onClickedNext={onClickedNext}
        onClickedPrevious={onPageClickedPrevious}
        disableNextButton={disableNextButton}
      />
    {:else}
      <ScrollMode 
        pages={visiblepages}
        onClickedNext={onClickedNext}
        disableNextButton={disableNextButton}
        onClickedPreviousChapter={onScrollClickedPrevious}
      />
    {/if}
  <!-- {/if} -->

</main>