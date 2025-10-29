<script lang="ts">
  import type { Data } from '$lib/server';
  import { createQuery } from '@tanstack/svelte-query';
  import LibraryView from './MediaLibrary.svelte';
  import { getData, reloadData } from '$lib/requests';

  const data = createQuery<Data>(() => ({
    queryKey: ['data'],
    queryFn: () => getData(),
  }));

  async function reloadButton() {
    await reloadData();
    await data.refetch();
  }
</script>

<button onclick={reloadButton}>Rescan media library</button>

{#if data.isPending}
  <h2>Loading library...</h2>
{:else if data.error}
  <h2>Error!</h2>
  <p>{data.error.message}</p>
{:else if data.isSuccess}
  {#each data.data.media as libraryEntry (libraryEntry.id)}
    <h2>{libraryEntry.name}</h2>
    <p>Staging: {libraryEntry.stagingRoot}</p>
    <p>Production: {libraryEntry.productionRoot}</p>
    <LibraryView library={libraryEntry} presets={data.data.presets} />
  {/each}
{/if}
