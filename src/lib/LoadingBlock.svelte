<div class="flex items-center justify-center my-6">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    class="animate-spin text-gray-600 dark:text-gray-300"
    fill="currentColor"
  >
    {#each Array(12) as _, i}
      <rect
        x="18"
        y="2"
        width="4"
        height="10"
        rx="2"
        ry="2"
        transform={`rotate(${i * 30} 20 20)`}
        opacity={(i + 1) / 12}
      />
    {/each}
  </svg>
</div>
