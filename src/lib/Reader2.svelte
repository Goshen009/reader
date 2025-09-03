<!-- <script lang="ts">
  import { createReader } from "../utils/reader";
  import { onMount } from "svelte";
  
  import Paragraph from "./Paragraph.svelte";
  import ParagraphSkeleton from "./ParagraphSkeleton.svelte";

  const reader = createReader();

  // const { data } = $props();

  let pageList = $state([]);

  let paragraphs = $state([]);

  const visiblePages = $derived(paragraphs.filter(p => p.number <= availablePages));

  onMount(async () => {
    const res = await fetch('/book_paragraphs.json');
    paragraphs = await res.json();
  });

  // onMount(() => {
  //   reader.load(data);
  // });

  let availablePages = $state(0);

  setInterval(() => {
    availablePages++;

    console.log(availablePages)
    console.log(visiblePages);
  }, 3000);

  const timerset = () => {
    setInterval(() => {
      availablePages++;

      console.log(availablePages)
      timerset();
    }, 3000);
  }



  // let's have a timer
  // such that every 5 seconds,
  // it increases a variable availableChapters
  // the chapters are already in an array
  // so we'll show as many chapters that are available
</script>


<div class={`min-h-screen p-4 bg-gray-50 text-gray-900`}>
  <div class="max-w-2xl mx-auto">
    {#each visiblePages as paragraph}
      <Paragraph content={paragraph.content}/>
    {/each}

    <ParagraphSkeleton/>
  </div>

  <div class="paragraph">
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio deserunt saepe deleniti cum sequi exercitationem nostrum tempore neque atque ipsa a reprehenderit molestiae, natus omnis maiores magnam iusto quia rem?
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil magnam odit architecto est nulla, voluptate laborum aperiam ut. Possimus omnis laborum sed neque dolorem incidunt sequi modi culpa consequatur nemo.
    </p>
  </div>
</div>

<style>
  .paragraph {
    opacity: 0;             /* start invisible */
    transition: opacity 3s ease-in-out; /* fade duration */
    margin-bottom: 1.5em;
    line-height: 1.6;
  }

  /* Add this class when you want the paragraph to appear */
  .paragraph.visible {
    opacity: 1;
  }
</style> -->


<script>
  import { onMount } from 'svelte';

  let paragraphs = [
    "Paragraph 1: Lorem ipsum dolor sit amet.",
    "Paragraph 2: Consectetur adipiscing elit.",
    "Paragraph 3: Sed do eiusmod tempor incididunt."
  ];

  // Track which paragraphs are visible
  let visibleCount = 0;

  onMount(() => {
    const interval = setInterval(() => {
      if (visibleCount < paragraphs.length) {
        visibleCount += 1;
      } else {
        clearInterval(interval);
      }
    }, 3000); // 3 seconds per paragraph
  });
</script>

<style>
  .paragraph {
    opacity: 0;
    transition: opacity 3s ease-in-out;
    margin-bottom: 1.5em;
  }
  .paragraph.visible {
    opacity: 1;
  }
</style>

<div>
  <div class={`min-h-screen p-4 bg-gray-50 text-gray-900`}>
  {#each paragraphs as para, index}
    <p class="paragraph" class:visible={index < visibleCount}>
      {para}
    </p>
  {/each}
  </div>
</div>
