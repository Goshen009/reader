<script>
  import Page from './Page.svelte';
  // import { onMount } from 'svelte';

  // let pages = [];
  // let bgColor = "white";
  // let fontSize = 16; // px

  // // Simulate fetching JSON from server
  // onMount(async () => {
  //   const res = await fetch('/pages.json'); // your preprocessed JSON
  //   pages = await res.json();
  // });

  // function increaseFont() { fontSize += 2; }
  // function decreaseFont() { fontSize -= 2; }
  // function toggleBackground() { bgColor = bgColor === 'white' ? '#1a1a1a' : 'white'; }

  let backgroundColour = "bg-gray-100";
  backgroundColour = "bg-red-200";

  let fontSize = "text-base";
  // fontSize = "text-sm";
  // fontSize = "text-lg";
</script>


<div class="flex flex-col items-center py-1">
  <Page content={""} {backgroundColour} {fontSize} />
  <Page content={""} {backgroundColour} {fontSize} />
  <Page content={""} {backgroundColour} {fontSize} />
</div>

<!-- <div class="reader" style="background-color:{bgColor}; color:{bgColor === 'white' ? 'black' : 'white'}; font-size:{fontSize}px;">
  <div class="controls p-4 flex gap-4">
    <button on:click={increaseFont}>A+</button>
    <button on:click={decreaseFont}>A-</button>
    <button on:click={toggleBackground}>Toggle Background</button>
  </div>

  {#each pages as page}
    <Page html={page.html} />
  {/each}
</div> -->

<!-- <style>
.reader {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 2rem 0;
}
.controls button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style> -->
