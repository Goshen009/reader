<script>

  const { page, onClickedNext, onClickedPrevious, disableNextButton } = $props();

</script>


<div id="page-mode">
  {#if page}
    <p>{page.text}</p>
  {:else}
    <p>Loading…</p>
  {/if}


  <button onclick={onClickedPrevious}>previous</button>
  <button onclick={onClickedNext} disabled={disableNextButton}>forward</button>
</div>