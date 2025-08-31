<script>

  const { pages, onClickedPreviousChapter, onClickedNext, disableNextButton } = $props();

</script>

<div id="scroll-mode">
  {#if pages}
    {#each pages as page}
      <p>{page.text}</p>
    {/each}
  {:else}
    <p>Loading…</p>
  {/if}


  <button onclick={onClickedPreviousChapter}>previous chapter</button>
  <button onclick={onClickedNext} disabled={disableNextButton}>Reveal Next</button>
</div>