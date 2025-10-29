<script lang="ts">
  import type { Data } from '$lib/server';
  import { createQuery } from '@tanstack/svelte-query';
  import LibraryView from './LibraryView.svelte';
  import { getData } from '$lib/requests';

  const data = createQuery<Data>(() => ({
    queryKey: ['data'],
    queryFn: () => getData(),
  }));
</script>

<h1>Transcoded Web UI</h1>

{#if data.isPending}
{:else if data.error}

{:else if data.isSuccess}
  {#each data.data.media as libraryEntry (libraryEntry.id)}
    <h2>{libraryEntry.name}</h2>
    <p>Staging: {libraryEntry.stagingRoot}</p>
    <p>Production: {libraryEntry.productionRoot}</p>
    <LibraryView library={libraryEntry} presets={data.data.presets} />
  {/each}
{/if}
