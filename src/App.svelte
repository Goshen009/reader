<script lang="ts">
  import { outpost } from "./utils/outpost";
  
  import { ok, err } from "neverthrow";
  import { onMount } from "svelte";
  import { fade } from 'svelte/transition';

  import Reader from "./lib/Reader.svelte";
  import ErrorHandler from "./lib/ErrorHandler.svelte";

  let tenantId = $state(null);
  let response = $state(null);

  onMount(async () => {
    // readen.netlify.app/<TENANT_ID>
    // readen.netlify.app/npQZB8

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') document.documentElement.classList.remove('dark');
    else document.documentElement.classList.add('dark');

    const start = Date.now();

    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    if (pathSegments.length !== 1) {      
      response = err({ type: "PATH" })
      return;
    }

    tenantId = pathSegments[0];

    const url = '/read';
    const options = { method: 'GET', headers: { 
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId
      } 
    };

    const result = await outpost(url, options);

    const elapsed = Date.now() - start;
    const minDelay = 3000;
    if (elapsed < minDelay) {
      await new Promise(resolve => setTimeout(resolve, minDelay - elapsed));
    }

    response = result;
  });

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
</script>

<main>
  <button onclick={toggleTheme} style="position: fixed; top: 0; left: 0; width: 1px; height: 1px; opacity: 0; pointer-events: all; z-index: 9999;">
    Toggle Theme
  </button>

  {#if response} 
    {#if response.isErr()}
      <ErrorHandler details={response.error} {tenantId}/>
    {:else}
      <Reader data={response.value} {tenantId}/>
    {/if}
  {:else}
    <div class="flex items-center justify-center min-h-screen px-4 bg-white dark:bg-gray-950 transition-colors duration-500">
      <div class="w-16 h-16 border-4 border-t-blue-500 border-b-purple-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
    </div>
  {/if}
</main>