import { getConfig, type Config } from './config';
import type { MediaLibrary } from './scanner/types';
import { findPresets, type PresetInfo } from './handbrakePresets';
import { scanLibrary } from './scanner';

export type Status = 'LOAD_CONFIG' | 'SCAN_MEDIA' | 'READY';

let config: Config | undefined;
let presets: PresetInfo[] = [];
let media: MediaLibrary[] = [];

/**
 * Start up the server
 *
 * 1. Load the config
 * 2. Load presets
 * 3. Scan media libraries
 */
export async function startup() {
  // Reset values
  config = undefined;
  presets = [];
  media = [];

  config = await getConfig();
  presets = await findPresets(config.presets);
  for (const library of config.libraries) {
    media.push(await scanLibrary(
      media.length,
      library.name,
      library.staging,
      library.production,
      presets,
    ));
  }
}

export function getStatus() {

}
