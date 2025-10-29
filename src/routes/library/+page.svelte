<script lang="ts">
  import LibraryView from './LibraryView.svelte';

  type Props = {
    data: import('./$types').PageData,
  };

  const { data }: Props = $props();
</script>

<h1>Transcoded Web UI</h1>

{#each data.media as libraryEntry (libraryEntry.id)}
  <h2>{libraryEntry.name}</h2>
  <p>Staging: {libraryEntry.stagingRoot}</p>
  <p>Production: {libraryEntry.productionRoot}</p>
  <LibraryView library={libraryEntry} presets={data.presets} />
{/each}
