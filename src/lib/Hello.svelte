<script lang="ts">
  import { fade } from 'svelte/transition';

  import { outpost } from "../utils/outpost";
  import { validate } from "email-validator";

  import NetworkError from "./NetworkError.svelte";
  import GeneralError from "./GeneralError.svelte";
  import Waitlist from "./Waitlist.svelte";

  const { tenantId } = $props();

  let error = $state(null);
  let isSubmitting = $state(false);

  let errorType = $state(null);
  let waitlistURL = $state(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    isSubmitting = true;
    error = null;

    const emailInput = document.getElementById('email-input') as HTMLInputElement;
    const email = emailInput.value;

    if (!validate(email)) {
      error = 'Invalid email';
      isSubmitting = false;
      return;
    }

    const url = '/login';
    const options = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
      },
      body: JSON.stringify({ email }),
    };
    const response = await outpost(url, options);

    if (response.isErr()) {
      errorType = response.error.type.toUpperCase();
      if (response.error.type === 'API') {
        // @ts-ignore
        errorType = `API_${response.error.status}`;
        
        // @ts-ignore
        if (response.error.status === 404) {
          // @ts-ignore
          // waitlistURL = response.error.body.waitlistURL;
        }
      }
      return;
    }

    console.log(`Logged in!`);
    window.location.reload();
  }
</script>

{#if errorType === "NETWORK"}
  <div transition:fade="{{ duration: 300 }}">
    <NetworkError/>
  </div>

{:else if errorType === "API_500"}
  <div transition:fade="{{ duration: 300 }}">
    <GeneralError heading={"Uh-oh!"} message={"Something went sideways on our end. Try refreshing, or come back in a bit."}/>
  </div>

{:else if errorType === "API_404"}
  <div transition:fade="{{ duration: 300 }}">
    <Waitlist {waitlistURL}/>
  </div>

{:else if errorType === "API_400"}
  <div transition:fade="{{ duration: 300 }}">
    <GeneralError heading={"Whoa!"} message={"This should never happen, but somehow it did. Refresh and try again."}/> <!-- This should never happen though -->
  </div>

{:else}
<div class="flex items-center justify-center min-h-screen px-4 bg-white dark:bg-gray-950 transition-colors duration-500">
  <div class="text-center max-w-md w-full">
    <h1 class="text-7xl font-extrabold text-transparent bg-clip-text 
               bg-gradient-to-r from-blue-500 to-purple-500 
               dark:from-purple-400 dark:to-pink-500 
               mb-4 drop-shadow-[0_0_15px_rgba(99,102,241,0.7)]
               dark:drop-shadow-[0_0_15px_rgba(236,72,153,0.7)]
               transition-all duration-500">
      Hello!
    </h1>

    <p class="text-gray-700 dark:text-gray-400 mb-6 text-base transition-colors duration-500">
      We need a tiny bit of info before you dive in.<br>Your email, please?
    </p>

    <form onsubmit={handleLogin} class="mt-12 flex flex-col items-center gap-2 max-w-sm mx-auto w-full">
      <div class="flex items-center gap-2 w-full">
        <input type="email" id="email-input" required placeholder="you@example.com"
          class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
            bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 transition"/>
        <button type="submit" disabled={isSubmitting} class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 dark:from-purple-500 dark:to-pink-500 text-white font-semibold hover:scale-105 transition-transform shadow-lg disabled:cursor-not-allowed">
          {#if isSubmitting}
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          {:else}
            Send
          {/if}
        </button>
      </div>

      {#if error}
        <span class="text-red-500 text-sm">
          {error}
        </span>
      {/if}
    </form>
  </div>
</div>
{/if}