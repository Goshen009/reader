<script>
  const { visible, onClick } = $props();
</script>

<style>
  button {
    display: none;
    margin-top: 20px;
    padding: 10px 20px;
    background: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
  button.visible {
    display: inline-block;
  }
</style>

<button onclick={onClick} class:visible={visible}>
  Claim Your Reward
</button>
