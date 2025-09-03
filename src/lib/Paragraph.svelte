<script>
  import { fade } from "svelte/transition";
  const { block, observe } = $props();
</script>

<p
  use:observe
  data-number={block.number}
  class="mb-6 leading-relaxed" transition:fade={{ duration: 1000 }}
>
  {@html block.content}
</p>