<script lang="ts">
  import Page from "./Page.svelte";

  // on the parent, only call view if there are pages !
  const { pageList, pageReached, currentPage, readingMode } = $props();

  const visiblePages = $derived(pageList.filter(p => p.number <= pageReached));

  let backgroundColour: string = $state("bg-red-200");
  let fontSize: string = $state("text-base");

  // for these two, remember to add them to localStorage too
  const changeBackgroundColour = (newColour: string) => backgroundColour = newColour
  const changeFontSize = (newSize: string) => fontSize = newSize
</script>

{#if readingMode === 'chapter'}
  <div class="flex flex-col items-center py-1">
    {#each visiblePages as page}
      <Page content={page.text} {backgroundColour} {fontSize} />
    {/each}
  </div>
{/if} 
