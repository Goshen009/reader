<script lang="ts">
  import { createReader } from "../utils/reader";
  import { createTimer } from "../utils/timer";
  import { onMount } from "svelte";

  import PageMode from "./PageMode.svelte";
  import ScrollMode from "./ScrollMode.svelte";

  import View from "./View.svelte";

  const { data } = $props();
  const { userEmail, userName } = data;

  const timer = createTimer();
  const reader = createReader();
  const countdown = timer.countdown;

  let pageList = $state([]);

  let pageReached = $state(data.pageReached);
  let readingMode = $state(localStorage.getItem(`${userEmail}:readingMode`) ?? "chapter");
  let currentPage = $state(Number(localStorage.getItem(`${userEmail}:currentPage`) ?? 4));

  onMount(() => {
    reader.load(data);

    if (currentPage > pageReached) {
      currentPage = pageReached;
    }

    pageList = reader.getCurrentChapter(currentPage)?.pages ?? null;
    if (!pageList) {
      alert("no page list. fix")
      return;
    }

    pageList.forEach(element => {
      console.log(JSON.stringify(element))
    });

    console.log(JSON.stringify(pageList));

    // lets get all the pages for that chapter up to where they have reached.




    // so, what do we want to do now?
    // we've got the page they've reached right?

    // let's have this
    // it'll show all the pages in that chapter up to where you've reached.
    // and then at the end -- you can swipe to go to the next chapter OR it's continous scroll

    // views is responsible for the background colour and fontsize. it just takes in the pages and displays them
    // reader is responsible for either swipe to next chapter OR continuous scolling (OR maybe, full swipe mode).
  })




  // let userEmail = null;
  let isLoading = $state(true);
  
  let storedMaxPage = $state(0);
  // let currentPage = $state(0);

  
  let pageMap = $derived(Object.fromEntries(pageList.map(p => [p.number, p])));
  let disableNextButton = $derived((currentPage === storedMaxPage && $countdown > 0));
  
  let visiblepages = $derived(pageList.filter(p => p.number <= storedMaxPage));
  
  // onMount(async () => {
  //   // NOTE: The keys here will be 'user-email:variable' e.g 'goshen009@gmail.com:currentPage'
  //   // TAKE NOTE! I'M YET TO SEE HOW TO SOLVE THIS!

  //   const info = reader.load(data);
  //   // storedMaxPage = info.pageReached;

  //   storedMaxPage = Number(localStorage.getItem(`${userEmail}:storedMaxPage`)) ?? 0;
  //   currentPage = Number(localStorage.getItem(`${userEmail}:currentPage`)) ?? 0;
  //   readingMode = localStorage.getItem(`${userEmail}:readingMode`) ?? "page";

    // pageList = reader.getCurrentChapter(currentPage).pages;

  //   // I haven't done a check here to know if the current page is null (user tampering w it or bugs)

  //   if (currentPage === storedMaxPage) {
  //     timer.start();
  //   }
  // });

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

  <View {pageList} {pageReached} {currentPage} {readingMode}/>

  <!-- <p>Timer: {$countdown > 0 ? $countdown : "Completed"}</p>

  <button onclick={() => readingMode = readingMode === "page" ? "scroll" : "page"}>Switch to {readingMode === "page" ? "Scroll" : "Page"}</button> -->

  <!-- {#if isLoading}
    <p>Loading pages... ⏳</p>
  {:else} -->
    <!-- {#if readingMode === 'page'}
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
    {/if} -->
  <!-- {/if} -->

</main>