<script>
  import { onMount } from 'svelte';
  let paragraphs = [];
  let revealed = 0;
  let lastInteraction = Date.now();
  const revealDelay = 3000;      // 3 seconds
  const pauseThreshold = 10000;  // 10 seconds inactivity

  // Theme toggle
  let darkMode = false;

  // Load paragraphs JSON
  onMount(async () => {
    const res = await fetch('/book_paragraphs.json');
    paragraphs = await res.json();
    startAutoReveal();
  });

  function updateInteraction() {
    lastInteraction = Date.now();
  }

  function startAutoReveal() {
    ['scroll','click','touchstart','keydown','wheel'].forEach(event =>
      window.addEventListener(event, updateInteraction)
    );

    const interval = setInterval(() => {
      if (revealed < paragraphs.length && Date.now() - lastInteraction < pauseThreshold) {
        revealed += 1;
      }
      if (revealed >= paragraphs.length) clearInterval(interval);
    }, revealDelay);
  }

  // Auto-scroll last paragraph
  $: if (revealed > 0) {
    const lastPara = document.querySelectorAll('.paragraph, .skeleton')[revealed-1];
    if (lastPara) lastPara.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
</script>

<!-- Theme toggle button -->
<div class="fixed top-4 right-4 z-50">
  <button
    class="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded"
    on:click={() => darkMode = !darkMode}>
    {darkMode ? 'Light Mode' : 'Dark Mode'}
  </button>
</div>

<div class={`min-h-screen p-4 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
  <div class="max-w-2xl mx-auto">

    {#each paragraphs as para, index}
      {#if index < revealed}
        <p class="paragraph opacity-0 transition-opacity duration-500 visible p-1 rounded">
          {@html para.content}
        </p>
      {:else}
        <div class="skeleton h-6 mb-6 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      {/if}
    {/each}

    <button
      class="reward-button mt-6 px-4 py-2 bg-green-500 text-white rounded transition-opacity duration-300"
      class:visible={revealed === paragraphs.length}>
      Claim Your Reward
    </button>
  </div>
</div>

<style>
  .paragraph.visible {
    opacity: 1;
  }

  .reward-button {
    opacity: 0;
    pointer-events: none;
  }
  .reward-button.visible {
    opacity: 1;
    pointer-events: auto;
  }
</style>
