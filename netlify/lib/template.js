export const templates = {
  alert: (msg) => `
    <script>
      alert(${JSON.stringify(msg)});
    </script>
  `,
}