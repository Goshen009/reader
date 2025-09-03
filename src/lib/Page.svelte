<script>
  const { content, backgroundColour, fontSize } = $props();
</script>

<div class={`min-h-[500px] text-gray-800 mt-1 p-6 max-w-lg w-full ${backgroundColour} ${fontSize}`}>
  {content}
</div>