<script>
  import { outpost } from "./utils/outpost";

  import { onMount } from "svelte";

  import Reader from "./lib/Reader.svelte";

  let isLoggedIn = false;
  let data = null;

  onMount(async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || null;

    const url = `/.netlify/functions/chapters?token=${token}`;
    const options = {
       method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
      
    const response = await outpost(url, options);

    if (response.isErr()) {    
      return;
    }

    data = response.value;
    isLoggedIn = true;
  });
</script>

<main>
  {#if isLoggedIn}
    <Reader data = {data}/>
  {/if}
</main>