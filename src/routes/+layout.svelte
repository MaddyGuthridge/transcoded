<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';

  const { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<h1>Transcoded Web UI</h1>

{@render children?.()}
