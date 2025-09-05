<script lang="ts">  
  import { createReader } from "../utils/reader";
  import { createSaver } from "../utils/saver";
  
  import { SvelteSet } from 'svelte/reactivity';
  import { fade } from 'svelte/transition';
  import { onMount } from "svelte";
  
  import NetworkError from "./NetworkError.svelte";

  import ChapterHeader from "./ChapterHeader.svelte";
  import LoadingBlock from "./LoadingBlock.svelte";
  import Paragraph from "./Paragraph.svelte";
  import Welcome from "./Welcome.svelte";
  import Panel from "./Panel.svelte";
    

  const { data, tenantId } = $props();
  const reader = createReader();
  const saver = createSaver();

  let visibleBlocks = $state(new SvelteSet<number>());
  let saveIntervalId = $state(null);
  let intervalId = $state(null);
  let isFailed = $state(false);
  let pending = $state(false);

  let toc = $state([]);
  let name = $state('');
  let blocks = $state(null); // the json array of blocks i.e paragraphs
  let blockReached = $state(0); // the stored 'paragraph number' on the server

  let display: 'WELCOME' | 'READING' | 'ERROR' = $state('WELCOME');
  const unlockedChapters = $derived(toc.filter(ch => ch.start_page <= blockReached));

  onMount(() => {
    saver.init(tenantId);
    reader.load(data);

    toc = reader.getTOC();
    name = reader.getName();
    blocks = reader.getBlocks();
    blockReached = reader.getBlockReached();
  });

  const onClickLogout = () => {
    reader.logout(tenantId);
  }

  const onClickContinue = () => {
    display = 'READING';

    startTimer();
    startSaveTimer();
  }

  const startSaveTimer = () => {
    saveIntervalId = setInterval(() => {
      console.log(`save interval`);
      
      saver.save(blockReached)
    }, 10 * 1000); // 10 seconds
  }

  const startTimer = () => {
    intervalId = setInterval(() => {
      if (saver.getFailed()) {
        display = 'ERROR';
        isFailed = true;
        return;
      }

      if (saver.getFailureCount() >= 2 || saver.getIsPending() === true) {
        pending = true;
        return;
      }

      pending = false;

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
    }, 3 * 1000); // 3 seconds
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

{#if display === 'READING'}
  <div class="flex flex-col items-start justify-start min-h-screen px-4 bg-white dark:bg-gray-950 transition-colors duration-500"> 
    <div class="max-w-xl mx-auto">
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

        {#if pending}
          <LoadingBlock/>
        {/if}
      {/if}

      <Panel {unlockedChapters} {toc} {visibleBlocks}/> 
    </div>
  </div>

{:else if display === 'WELCOME'}
  <div transition:fade="{{ duration: 300 }}">
    <Welcome {name} {onClickContinue} {onClickLogout}/>
  </div>

{:else if display === 'ERROR'}
  <div transition:fade="{{ duration: 300 }}">
    <NetworkError/>
  </div>
{/if}