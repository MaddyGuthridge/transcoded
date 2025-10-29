<script lang="ts">
  import type { PresetInfo } from '$lib/server/handbrakePresets';
  import type { MediaItem } from '$lib/server/scanner/types';
  import MediaFile from './MediaFile.svelte';

  type Props = {
    libraryId: number,
    item: MediaItem,
    presets: PresetInfo[],
  };

  const { libraryId, item, presets }: Props = $props();

  let expanded = $state(false);

  const mainFile = $derived(item.files.find(f => f.id === item.mainFile));
  const title = $derived(`${expanded ? '▾' : '▸'} ${item.path}`);

  function toggle() {
    expanded = !expanded;
  }
</script>

<tr role="switch" aria-checked={expanded} onclick={toggle}>
  {#if mainFile}
    {#if !expanded}
      <MediaFile
        file={mainFile}
        {libraryId}
        itemId={item.id}
        {presets}
        main={false}
        titleOverride={title}
      />
    {:else}
      <td>{title}</td>
    {/if}
  {:else}
    <td>{title}</td>
  {/if}
</tr>
{#if expanded}
  {#each item.files as file (file.id)}
    <tr>
      <MediaFile
        file={file}
        {libraryId}
        itemId={item.id}
        {presets}
        main={false}
      />
    </tr>
  {/each}
{/if}
