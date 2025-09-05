<script lang="ts">
  const { waitlistURL } = $props();
</script>

<div class="flex items-center justify-center min-h-screen px-4 bg-white dark:bg-gray-950 transition-colors duration-500">
  <div class="text-center max-w-md w-full">
    <h1 class="text-7xl font-extrabold text-transparent bg-clip-text 
               bg-gradient-to-r from-blue-500 to-purple-500 
               dark:from-purple-400 dark:to-pink-500 
               mb-4 drop-shadow-[0_0_15px_rgba(99,102,241,0.7)]
               dark:drop-shadow-[0_0_15px_rgba(236,72,153,0.7)]
               transition-all duration-500">
      Whoops!
    </h1>

    <p class="text-gray-700 dark:text-gray-400 mb-6 text-base transition-colors duration-500">
      We couldn’t find you. Are you using the right link, and did you join the waitlist?
    </p>

    <!-- <a href={waitlistURL} class="text-blue-500 mt-6 dark:text-pink-400 font-semibold hover:underline inline-block">
      Join the waitlist
    </a> -->
  </div>
</div>