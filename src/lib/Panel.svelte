<script lang="ts">
  import { onMount } from "svelte";

  const { toc, visibleBlocks, unlockedChapters } = $props();

  let showPanel = $state(true);
  let lastScrollY = $state(0);

  onMount(() => {
    // window.addEventListener('scroll', handleScroll);
    // return () => window.removeEventListener('scroll', handleScroll);
  });

  // const handleScroll = () => {
  //   const currentScrollY = window.scrollY;
  //   if (currentScrollY < lastScrollY) {
  //     showPanel = true;
  //   } else {
  //     showPanel = false;
  //   }
  //   lastScrollY = currentScrollY;
  // }

  let selectEl: HTMLSelectElement;

  const goToChapter = (event) => {
    const selected = (event.target as HTMLSelectElement).value;
    if (!selected) return;

    const el = document.getElementById(`chapter-${selected}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  const getCurrentChapter = () => {
    if (visibleBlocks.size === 0) return null;

    const minVisible = Math.min(...visibleBlocks);
    const chapter = toc.find(c => minVisible >= c.start_page && minVisible <= c.end_page);
    return chapter?.chapter ?? null;
  }
</script>

<div class="fixed top-4 right-4">
  <div class="max-w-xs relative">
    <div class="transition-transform duration-500"
         style:transform={showPanel ? 'translateY(0%)' : 'translateY(-200%)'}>

      <!-- wrapper to overlay text -->
      <div class="relative">
        <select
          bind:this={selectEl}
          onchange={goToChapter}
          class="px-2 py-2 rounded-full text-xs font-semibold
                 bg-gray-200 text-gray-700 border border-blue-500
                 dark:bg-gray-800 dark:text-gray-200 dark:border-purple-500
                 appearance-none focus:outline-none relative z-0 opacity-0 w-full"
        >
          {#each unlockedChapters as ch}
            <option value={ch.chapter}>
              Chapter {ch.chapter}
            </option>
          {/each}
        </select>

        <!-- overlay text showing current chapter -->
        <div class="px-2 py-2 rounded-full text-xs font-semibold
              bg-gray-200 text-gray-700 border border-blue-500
              dark:bg-gray-800 dark:text-gray-200 dark:border-purple-500
              transition-colors duration-300
              absolute top-0 left-0 w-full h-full flex items-center justify-center
              pointer-events-none">
          {getCurrentChapter()}
        </div>
      </div>

    </div>
  </div>
</div>


<!-- <div class="fixed bottom-4 left-0 right-4">
  <div class="max-w-xl mx-auto flex justify-end">
    <div 
      class="transition-transform duration-500"
      style:transform={showPanel ? 'translateY(0%)' : 'translateY(200%)'}
    >
      <select
        onchange={goToChapter}
        class="px-4 py-2 rounded-full text-sm font-medium
              bg-gray-200 text-gray-700 border-2 border-blue-500
              dark:bg-gray-800 dark:text-gray-200 dark:border-purple-500
              transition-colors duration-300
              appearance-none focus:outline-none"
      >
        {#each unlockedChapters as chapter}
          <option value={chapter.chapter}>
            Chapter {chapter.chapter}
          </option>
        {/each}
      </select>
    </div>
  </div>
</div> -->