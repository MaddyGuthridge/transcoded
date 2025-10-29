<script lang="ts">
  import type { PresetInfo } from '$lib/server/handbrakePresets';
  import type { MediaLibrary } from '$lib/server/scanner/types';
  import MediaItem from './MediaItem.svelte';

  type Props = {
    library: MediaLibrary,
    presets: PresetInfo[],
  };

  const { library, presets }: Props = $props();
</script>

<table>
  <thead>
    <tr>
      <th>Media</th>
      {#each presets as preset (preset.id)}
        <th>{preset.name}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each library.items as item (item.id)}
      <MediaItem {item} libraryId={library.id} {presets} />
    {/each}
  </tbody>
</table>
