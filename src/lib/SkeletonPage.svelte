<script>
  const { backgroundColour, countdown, revealNextPage } = $props();
</script>

<div class={`animate-pulse min-h-[500px] mt-1 p-6 max-w-lg w-full flex flex-col justify-center ${backgroundColour}`}>
  {#if countdown > 0}
    <div class="w-full bg-gray-300 h-2 rounded">
      <div class="bg-blue-600 h-2 rounded transition-all" style="width: 50%"></div>
    </div>
    <p class="text-xs text-gray-600 mt-2 text-center">{countdown}s remaining...</p>
  {:else}
    <button onclick={revealNextPage} class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
      Reveal next page
    </button>
  {/if}
</div>