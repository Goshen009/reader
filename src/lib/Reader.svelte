<script lang="ts">
  import RewardButton from "./RewardButton.svelte";

  let currentParagraphId = null;  // shared state

  let visibleParagraphs = $state([]);

   // 1. Create observer once
  const paragraphObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      if (entry.isIntersecting) {
        if (!visibleParagraphs.includes(id)) visibleParagraphs.push(id);
      } else {
        visibleParagraphs = visibleParagraphs.filter(p => p !== id);
      }
    });
  }, { threshold: 0.6 }); // visible if 60% in view

  // Returns the topmost visible paragraph
// function getTopmostParagraph() {
//   const visible = Array.from(visibleParagraphs); // from your Set
//   if (visible.length === 0) return null;

//   return visible.reduce((topmost, current) => {
//     const topTop = topmost.getBoundingClientRect().top;
//     const currentTop = current.getBoundingClientRect().top;
//     return currentTop < topTop ? current : topmost;
//   });
// }

// Returns the topmost visible paragraph
function getTopmostParagraph() {
  if (visibleParagraphs.length === 0) return null;

  return visibleParagraphs
    .map(id => document.getElementById(id))   // convert ID → element
    .filter(el => el !== null)                // ignore if not found
    .reduce((topmost, current) => {
      const topTop = topmost.getBoundingClientRect().top;
      const currentTop = current.getBoundingClientRect().top;
      return currentTop < topTop ? current : topmost;
    });
}


function canUserScroll() {
  return document.documentElement.scrollHeight > window.innerHeight;
}



  // The observer keeps this updated
  // const paragraphObserver = new IntersectionObserver((entries) => {
  //   const visible = entries
  //     .filter(e => e.isIntersecting)
  //     .map(e => e.target);

  //   if (visible.length > 0) {
  //     // Pick the first visible one in document order
  //     visible.sort((a, b) => a.offsetTop - b.offsetTop);
  //     currentParagraphId = visible[0].id;
  //   }
  // }, { threshold: 0.5 }); // 50% visible before we "count it"


  // const observer = new IntersectionObserver((entries) => {
  //   entries.forEach(entry => {
  //     if (entry.isIntersecting) {
  //       console.log("Visible:", entry.target.id);
  //     } else {
  //       console.log("Not visible:", entry.target.id);
  //     }
  //   });
  // }, { threshold: 0.5 }); // 50% visible counts as "in view"









//   function createParagraphObserver(callback) {
//     const observer = new IntersectionObserver((entries) => {
//       const visibleParagraphs = [];

//       for(const entry of entries) {
//         if (entry.isIntersecting) {
//           visibleParagraphs.push(entry.target)
//         }
//       }

//       callback(visibleParagraphs);
//     }, {
//       root: null,
//       threshold: 0.1
//     });

//     return observer;
//   }

// // --- USAGE EXAMPLE ---

// // 1. Create the observer
// const paragraphObserver = createParagraphObserver((visible) => {
//   console.log("Currently visible paragraphs:", visible.map(p => p.id));
// });

// // 2. Attach it to all paragraphs
// document.querySelectorAll("p[id^='paragraph-']").forEach(p => {
//   paragraphObserver.observe(p);
// });


//   function createPageObserver(callback) {
//   const observer = new IntersectionObserver((entries) => {
//     let maxPage = 0;
//     for (const entry of entries) {
//       if (entry.isIntersecting) {
//         const pageNum = parseInt(entry.target.page, 10);
//         maxPage = Math.max(maxPage, pageNum);
//       }
//     }

//     const canScroll = document.body.scrollHeight > window.innerHeight;
//     callback({ currentPage: maxPage, canScroll });  
//   }, {
//     root: null,
//     threshold: 0.5, // half of element visible counts
//   });

//   return observer;
// }


  const { data } = $props();
  const { userEmail, userName } = data;

  const timer = createTimer();
  const reader = createReader();
  const countdown = timer.countdown;

  let pageReached = $state(0);


  // let's see.
  // we have the maximum page reached

  // as each page is revealed.
  // the maximum page reached is increased


  // for next, check the maximum page reached
  // check the page number of the last page in that chapter
  // if the maximum page is greater than it, then allow next
  // if it is less than, do not allow -- you've not reached
  // if it is equal, then you're just about to switch


  

  let pageList = $state(null);
  let lastPageNumber = $derived(pageList[pageList.length -1].number);

  let currentPage = $state(Number(localStorage.getItem(`${userEmail}:currentPage`) ?? 0));

  const loadPageReached = () => {
    return Number(localStorage.getItem(`${userEmail}:pageReached`) ?? 0);
  }

  const savePageReached = (val) => {
    localStorage.setItem(`${userEmail}:pageReached`, String(val));
  }

  // onMount(() => {
  //   reader.load(data);

  //   blocks = reader.getBlocks();
  //   blockReached = data.blockReached;

  //   // pageReached = loadPageReached();

  //   // currentPage = 0;
  //   // pageList = reader.getCurrentChapter(currentPage).pages;

  //   // startTimer();
  //   start();
  // });

  // let intervalId = null;

  // const startTimer = () => {

  //   // I only want to increment the pageReached on when?
  //   // Because in the advent that someone scrolls to a different chapter
  //   // Will this timer keep on increasing the pageReached?

  //   // So what's an idea here?

  //   intervalId = setInterval(() => {
  //     pageReached += 1; // do some checks here sha.

  //     if (pageReached % 5 === 0) {
  //       savePageReached(pageReached);
  //     }
  //   }, 3000);
  // }

  const start = () => {
    const interval = setInterval(() => {
      console.log(getTopmostParagraph())
      console.log(`can user scroll: ${canUserScroll()}`)

      if (currentPage < lastPageNumber) {
        currentPage += 1;
        localStorage.setItem(`${userEmail}:currentPage`, String(currentPage));
      } else {
        clearInterval(interval);
      }
    }, 3000);
  }

  const next = () => {
    pageList = reader.getNextChapter(currentPage).pages;
    start();

    // make a call to the db that the user has finished that chapter
    // it loads until it's done.
  }

  const onClickPrevious = () => {
    pageList = reader.getPreviousChapter(currentPage);
  }


  
  import { createReader } from "../utils/reader";
  import { createTimer } from "../utils/timer";
  
  import { SvelteSet } from 'svelte/reactivity';
  import { onMount } from "svelte";
  
  import ChapterHeader from "./ChapterHeader.svelte";
  import Paragraph from "./Paragraph.svelte";
  import Panel from "./Panel.svelte";


  let darkMode = $state(localStorage.getItem('theme') === 'dark' || localStorage.getItem('theme') === null);
  let visibleBlocks = $state(new SvelteSet<number>());
  let intervalId = $state(null);

  let blocks = $state(null); // the json array of blocks i.e paragraphs
  let blockReached = $state(0); // the stored 'paragraph number' on the server
  let currentChapter = $state(localStorage.getItem(`${userEmail}:currentChapter`) ?? 'Chapter-1'); // used for navigation -- either by # (deep link) or swiping.

  const toggleTheme = () => {
    darkMode = !darkMode;
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }

  onMount(() => {
    reader.load(data);
    blocks = reader.getBlocks();
    blockReached = data.blockReached;

    startTimer();
  });

  const startTimer = () => {
    intervalId = setInterval(() => {
      if (visibleBlocks.size > 0) {
        const maxVisible = Math.max(...visibleBlocks);
        if (maxVisible >= blockReached - 5) {
          blockReached += 1;
        } else {
          console.log("User scrolled too far up, pausing gating");
        }
      } else {
        blockReached += 1;
      }

      if (blockReached % 5 === 0) {
        savePageReached(pageReached); // change this to be the actual saving part. hand it off to reader.
      }
    }, 3000);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target as HTMLElement;
      const num = parseInt(el.dataset.number);

      if (entry.isIntersecting) {
        visibleBlocks.add(num);
      } else {
        visibleBlocks.delete(num);
      }
    });
  }, {
    root: null,
    threshold: 0.5
  });

  const observe = (element: HTMLElement) => {
    observer.observe(element);
    return {
      destroy() {
        observer.unobserve(element);
      }
    }
  }
  
</script>

<div class={`min-h-screen p-6 transition-colors duration-500 ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-300 text-gray-900'}`}>
  <div class="max-w-xl mx-auto bg-inherit">
    {#if blocks}
      {#each blocks as block, index}
        {#if block.type}
          {#if block.number <= blockReached} <!-- only show the paragraphs up to where the system has revealed -->
            <ChapterHeader {block} {observe}/>
          {/if}
        {:else}
          {#if block.number <= blockReached}
            <Paragraph {block} {observe}/>
          {/if}
        {/if}
      {/each}
    {/if}

    <Panel {toggleTheme} {onClickPrevious} {reader} {currentPage} {darkMode}/>    
  </div>
</div>