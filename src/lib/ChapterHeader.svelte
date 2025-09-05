<script>
  import { fade } from "svelte/transition";
  const { block, observe } = $props();
</script>

<div 
  use:observe
  data-number={block.number}
  id={`chapter-${block.content}`}
  class="my-12 flex flex-col items-center text-center" transition:fade={{ duration: 1000 }}
>
  <div class="text-6xl font-bold mb-2 
              text-gray-900 dark:text-gray-100 
              transition-colors duration-500">
    {block.content}
  </div>
</div>