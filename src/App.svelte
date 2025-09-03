<script>
  import { outpost } from "./utils/outpost";
  import { onMount } from "svelte";

  import Reader from "./lib/Reader.svelte";

  let data = null;

  onMount(async () => {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const tenantId = pathSegments[0];

    // const url = `/chapters/${tenantId}`;
    const url = '/response.json';
    const options = { method: 'GET', headers: { 'Content-Type': 'application/json' } };

    const response = await outpost(url, options);

    if (response.isErr()) {
      if (response.error.type === "API") {
        
      } else {
        // network error
      }
      alert(JSON.stringify(response.error));
    }

    data = response.value;

    // Somehow, I gotta show who's logging in sha 
    // just so you know
  })
</script>

<main>
  {#if data}
    <Reader {data}/>
  {/if}
</main>