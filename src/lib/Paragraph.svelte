<script>
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  const { block, observe } = $props();
</script>

<p
  use:observe
  data-number={block.number}
  class="mb-6 leading-relaxed 
         text-gray-800 dark:text-gray-300 
         transition-colors duration-500"
  transition:fly={{ y: 30, duration: 1500, easing: cubicOut }}
>
  {@html block.content}
</p>  