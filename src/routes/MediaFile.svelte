<script lang="ts">
  import type { PresetInfo } from '$lib/server/handbrakePresets';
  import type { EncodeStatus, MediaFile } from '$lib/server/scanner/types';

  type Props = {
    file: MediaFile,
    presets: PresetInfo[],
    /** Whether this is the main feature for the media item */
    main: boolean,
    /** Override the title */
    titleOverride?: string | undefined,
  };

  const { main, file, presets, titleOverride = undefined }: Props = $props();

  function representStatus(status: EncodeStatus) {
    switch (status) {
      case 'complete': return '✅';
      case 'encoding': return '⏳';
      case 'queued': return '🕑';
    }
  }

  const title = $derived(titleOverride ?? `${main ? '⭐ ' : ''}${file.path}`);
</script>

<td>{title}</td>
{#each presets as preset (preset.id)}
  {@const encoding = file.encodings.find(enc => enc.preset === preset.id)}
  <td>
    {#if encoding !== undefined}
      {representStatus(encoding.status)}
    {:else}
      ❌
    {/if}
    </td>
{/each}
