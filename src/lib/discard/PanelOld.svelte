<script lang="ts">
  import { onMount } from "svelte";

  const { reader, onClickPrevious, currentPage, darkMode, toggleTheme } = $props();

  let showPanel = $state(true);
  let lastScrollY = $state(0);

  let cannotClickPrevious = $derived(reader.getPreviousChapter(currentPage) === null)

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY < lastScrollY) {
      showPanel = true;
    } else {
      showPanel = false;
    }
    lastScrollY = currentScrollY;
  }
</script>

<div class={`fixed bottom-0 max-w-xl mx-auto left-0 right-0 h-16 transition-colors duration-500 transition-transform duration-500 flex items-center ${darkMode ? 'bg-inherit border-t border-gray-600' : 'bg-inherit border-t border-gray-400'}`} style:transform={showPanel ? 'translateY(0%)' : 'translateY(100%)'}>
  <div class="w-3/4 flex justify-center items-center">
    <div class={`flex rounded-full border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} shadow-md overflow-hidden`}>
      <button onclick={onClickPrevious} disabled={cannotClickPrevious} class={`px-4 py-2 rounded transition-colors duration-200 ${ cannotClickPrevious ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'}`}>
        &lt;
      </button>

      <div class="px-6 py-2 flex items-center justify-center cursor-default select-none">
        Chapter {currentPage}
      </div>

      <button class="px-4 py-2 transition-colors duration-200">
        &gt;
      </button>
    </div>
  </div>

  <div class="w-1/4 flex justify-center items-center">
    <button onclick={toggleTheme} class={`px-4 py-2 rounded-full ${darkMode ? 'bg-gray-800 text-gray-50' : 'bg-gray-100 text-gray-900'} shadow-md hover:scale-110 transition-transform duration-200`}>
      {#if darkMode}
        🌞
      {:else}
        🌙
      {/if}
    </button>
  </div>
</div>