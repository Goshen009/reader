<script lang="ts">
  import NetworkError from "./NetworkError.svelte";
  import GeneralError from "./GeneralError.svelte";
  import Hello from "./Hello.svelte";

  import { onMount } from "svelte";
  import { fade } from 'svelte/transition';

  type Display = 'HELLO' | 'ERROR' | 'NETWORK';

  interface ErrorInfo {
    display: Display;
    heading: string;
    message: string;
  }

  const errorMap: Record<string, ErrorInfo> = {
    'PATH': {
      display: 'ERROR',
      heading: 'Oops!',
      message: 'This link isn’t valid — use the one that was sent to you.'
    },
    'API_404_TENANT': {
      display: 'ERROR',
      heading: 'Whoa!',
      message: 'This should never happen, but somehow it did. Anyhoo, use the link that was sent to you.'
    },
    'API_404_BOOK': {
      display: 'ERROR',
      heading: 'Oops!',
      message: 'This link isn’t valid — use the one that was sent to you.'
    },
    'API_404_COOKIE': {
      display: 'HELLO',
      heading: '',
      message: ''
    },
    'API_404_USER': {
      display: 'HELLO',
      heading: '',
      message: ''
    },
    'API_400': {
      display: 'HELLO',
      heading: '',
      message: ''
    },
    'API_403': {
      display: 'ERROR',
      heading: 'Hold Up!',
      message: 'This book isn’t available yet — check back on the release date.'
    },
    'API_500': {
      display: 'ERROR',
      heading: 'Uh-oh!',
      message: 'Something went sideways on our end. Try refreshing, or come back in a bit.'
    },
    'NETWORK': {
      display: 'NETWORK',
      heading: 'Uh-oh!',
      message: 'We can’t reach the server right now. Check your connection and try again.'
    }
  };

  const { details, tenantId } = $props();

  console.log(details);

  let heading = $state('');
  let message = $state('');
  let display: Display | null = $state(null);

  onMount(() => {

    let key = details.type.toUpperCase();

    if (key === 'API') {
      key = `API_${details.status}`;
      if (details.status === 404) {
        key += `_${details.body.errorType}`;
      }
    }

    const errorInfo = errorMap[key];
    if (errorInfo) {
      display = errorInfo.display;
      heading = errorInfo.heading;
      message = errorInfo.message;
    }
  });
</script>

{#if display === "ERROR"}
  <div transition:fade="{{ duration: 300 }}">
    <GeneralError {heading} {message} />
  </div>
{:else if display === "HELLO"}
  <div transition:fade="{{ duration: 300 }}">
    <Hello {tenantId} />
  </div>
{:else if display === "NETWORK"}
  <div transition:fade="{{ duration: 300 }}">
    <NetworkError />
  </div>
{/if}