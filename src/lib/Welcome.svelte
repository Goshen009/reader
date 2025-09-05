<script lang="ts">
  const { name, onClickContinue, onClickLogout } = $props();
</script>

<div class="flex items-center justify-center min-h-screen px-4 bg-white dark:bg-gray-950 transition-colors duration-500">
  <div class="text-center max-w-md w-full">
    
    <!-- Heading -->
    <h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text
               bg-gradient-to-r from-blue-500 to-purple-500
               dark:from-purple-400 dark:to-pink-500
               mb-14 drop-shadow-[0_0_15px_rgba(99,102,241,0.7)]
               dark:drop-shadow-[0_0_15px_rgba(236,72,153,0.7)]
               transition-all duration-500">
      Welcome,<br>{name}!
    </h1>

    <!-- Subtext -->
    <!-- <p class="text-gray-700 dark:text-gray-400 mb-12 text-base transition-colors duration-500">
      You're all set to continue reading.
    </p> -->

    <!-- Continue Button -->
    <button onclick={onClickContinue} class="w-auto px-16 py-3 mb-4 rounded-lg text-white font-semibold 
                   bg-gradient-to-r from-blue-500 to-purple-500 
                   dark:from-purple-400 dark:to-pink-500
                   hover:scale-105 transition-transform shadow-lg">
      Read
    </button>

    <div class="">
      <!-- Small Logout Button -->
      <button onclick={onClickLogout} class="text-sm text-gray-500 dark:text-gray-300 hover:underline transition-colors duration-200">
        Not You? Logout
      </button>
    </div>

  </div>
</div>
