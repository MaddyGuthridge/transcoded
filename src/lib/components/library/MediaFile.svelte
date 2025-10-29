<script lang="ts">
  import { queueTranscoding } from '$lib/requests';
  import type { PresetInfo } from '$lib/server/handbrakePresets';
  import type { EncodingInfo, MediaFile } from '$lib/server/scanner/types';
  import { useQueryClient } from '@tanstack/svelte-query';

  type Props = {
    libraryId: number,
    itemId: number,
    file: MediaFile,
    presets: PresetInfo[],
    /** Whether this is the main feature for the media item */
    main: boolean,
    /** Override the title */
    titleOverride?: string | undefined,
  };

  const { libraryId, itemId, file, main, presets, titleOverride = undefined }: Props = $props();

  const queryClient = useQueryClient();

  function representStatus(encoding: EncodingInfo) {
    switch (encoding.status) {
      case 'complete': return `✅ ${encoding.filename}`;
      case 'encoding': return '⏳';
      case 'queued': return '🕑';
    }
  }

  const title = $derived(titleOverride ?? `${main ? '⭐ ' : ''}${file.path}`);

  async function enqueue(presetId: number) {
    await queueTranscoding(libraryId, itemId, file.id, presetId);
    // Force an update of the queue
    await queryClient.invalidateQueries({ queryKey: ['queue'] });
  }
</script>

<td>{title}</td>
{#each presets as preset (preset.id)}
  {@const encoding = file.encodings.find(enc => enc.preset === preset.id)}
  <td>
    {#if encoding !== undefined}
      {representStatus(encoding)}
    {:else}
      <button onclick={() => (void enqueue(preset.id))}>❌</button>
    {/if}
  </td>
{/each}
