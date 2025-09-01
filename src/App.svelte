<script>
  import { outpost } from "./utils/outpost";
  import { onMount } from "svelte";

  import Reader from "./lib/Reader.svelte";

  let data = null;

  onMount(async () => {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const tenantId = pathSegments[0];

    // const url = `/chapters/${tenantId}`;
    // const options = { method: 'GET', headers: { 'Content-Type': 'application/json' } };

    // const response = await outpost(url, options);

    // if (response.isErr()) {
    //   if (response.error.type === "API") {
        
    //   } else {
    //     // network error
    //   }
    //   alert(JSON.stringify(response.error));
    // }

    data = {
    "userEmail": "canon0169@gmail.com",
    "userName": "Time",
    "isScheduleCompleted": true,
    "pageReached": 5,
    "chapters": [
        {
            "_id": "68b39cee2c7112d46e71c73f",
            "tenant_id": "test",
            "chapter": 1,
            "title": "Chapter 1: The Beginning",
            "start_page": 0,
            "end_page": 3,
            "pages": [
                {
                    "number": 0,
                    "text": "Welcome to DeepGate 🌀"
                },
                {
                    "number": 1,
                    "text": "This is page two..."
                },
                {
                    "number": 2,
                    "text": "Here's page three..."
                },
                {
                    "number": 3,
                    "text": "And the end 🎉"
                }
            ]
        },
        {
            "_id": "68b39cee2c7112d46e71c740",
            "tenant_id": "test",
            "chapter": 2,
            "title": "Chapter 2: Deeper Gate",
            "start_page": 4,
            "end_page": 7,
            "pages": [
                {
                    "number": 4,
                    "text": "Ch 2 -- Welcome to DeepGate 🌀"
                },
                {
                    "number": 5,
                    "text": "Ch 2 -- This is page two..."
                },
                {
                    "number": 6,
                    "text": "Ch 2 -- Here's page three..."
                },
                {
                    "number": 7,
                    "text": "Ch 2 -- And the end 🎉"
                }
            ]
        },
        {
            "_id": "68b39cee2c7112d46e71c741",
            "tenant_id": "test",
            "chapter": 3,
            "title": "Chapter 3: The Unknown",
            "start_page": 8,
            "end_page": 11,
            "pages": [
                {
                    "number": 8,
                    "text": "Ch -- 3 Welcome to DeepGate 🌀"
                },
                {
                    "number": 9,
                    "text": "Ch -- 3 This is page two..."
                },
                {
                    "number": 10,
                    "text": "Ch -- 3 Here's page three..."
                },
                {
                    "number": 11,
                    "text": "Ch -- 3 And the end 🎉"
                }
            ]
        }
    ]
}

    // data = response.value;

    // Somehow, I gotta show who's logging in sha 
    // just so you know
  })
</script>

<main>
  {#if data}
    <Reader {data}/>
  {/if}
</main>