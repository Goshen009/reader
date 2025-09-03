<script lang="ts">
  import { onMount } from "svelte";

  import ParagraphSkeleton from "./ParagraphSkeleton.svelte";
  import Paragraph from "./Paragraph.svelte";
  

  // let paragraphs = $state([]);

  // onMount(async () => {
  //   const res = await fetch('/book_paragraphs.json');
  //   paragraphs = await res.json();

  //   console.log(paragraphs);
  // });

  let paragraphs = [
  {
    "number": 1,
    "content": "As I made some final touches to the last letter, I realized that I've written so much about the death of Jesus, I haven't written enough about his resurrection!"
  },
  {
    "number": 3,
    "content": "Jesus died to save us from our sins, but that's not where the story ends - there's more to it! The song of the day (listen to it as you read) is <strong>Resurrecting</strong> by <strong>Elevation Worship </strong>(<u><em>Spotify</em></u><em>, </em><u><em>Apple Music</em></u>)."
  },
  {
    "number": 5,
    "content": "Alright! For those new to the Christian faith, Jesus was a man who lived about two thousand years ago. We believe that he is the Son of God and the One who saved us from our sin and its consequences."
  }];

  setTimeout(() => {
    console.log("timed");

    paragraphs.push({
    "number": 1,
    "content": "As I made some final touches to the last letter, I realized that I've written so much about the death of Jesus, I haven't written enough about his resurrection!"
  },)
  }, 3000);

</script>

<div class={`min-h-screen p-4 bg-gray-50 text-gray-900`}>
  <div class="max-w-2xl mx-auto">
    {#each paragraphs as paragraph}
      <!-- <Paragraph content={paragraph.content}/> -->
    {/each}

    <ParagraphSkeleton/>
  </div>
</div>