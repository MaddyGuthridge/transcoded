<script lang="ts">
  import type { PresetInfo } from '$lib/server/handbrakePresets';
  import type { MediaItem } from '$lib/server/scanner/types';
  import MediaFile from './MediaFile.svelte';

  type Props = {
    item: MediaItem,
    presets: PresetInfo[],
  };

  const { item, presets }: Props = $props();

  let expanded = $state(false);

  function toggle() {
    expanded = !expanded;
  }
</script>

<tr role="switch" aria-checked={expanded} onclick={toggle}>
  <td>{expanded ? '▾' : '▸'} {item.title}</td>
</tr>
{#if expanded}
  {#each item.files as file (file.id)}
    <MediaFile {file} {presets} main={file.id === item.mainFile} />
  {/each}
{/if}
