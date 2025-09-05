<script lang="ts">
  // import { outpost } from "../utils/outpost";
  import { outpost } from "../../utils/outpost";

  const { tenantId } = $props();

  let email = $state(null);
  let error = $state(null);
  let isSubmitting = $state(false);

  const handleLogin = async () => {
    error = null;
    isSubmitting = true;
    
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
      console.log(`An error: ${JSON.stringify(response.error)}`);
      return;
    }

    console.log(`Logged in!`);
  }
</script>


<div class="login-container">
  <input type="email" bind:value={email} placeholder="Enter your email">
  <button onclick={handleLogin} disabled={isSubmitting}> {isSubmitting ? "Logging in..." : "Log In"} </button>
</div>



<style>
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    gap: 1rem;
  }
  input {
    padding: 0.5rem 1rem;
    width: 250px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  input.error {
    border-color: red;
  }
  button {
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 5px;
    background-color: #007acc;
    color: white;
    cursor: pointer;
  }
  button:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
  .error-text {
    color: red;
    font-size: 0.875rem;
    text-align: center;
  }
</style>