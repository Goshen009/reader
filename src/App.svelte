<script>
  import { outpost } from "./utils/outpost";
  import { onMount } from "svelte";

  import Reader from "./lib/Reader.svelte";

  import Test from "./lib/Test.svelte";

  import Chapter from "./lib/Chapter.svelte";

  import Reader2 from "./lib/Reader2.svelte";

  const test = import.meta.env.VITE_TESTING_KEY;
  
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

  <!-- <Test/> -->

  <!-- <Chapter /> -->

  <!-- <Reader2/> -->
</main>