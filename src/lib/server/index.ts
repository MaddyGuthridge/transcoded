import { getConfig, type Config } from './config';
import type { MediaLibrary } from './scanner/types';
import { findPresets, type PresetInfo } from './handbrakePresets';
import { scanLibrary } from './scanner';
import * as log from './log';

export type Status = 'LOAD_CONFIG' | 'SCAN_MEDIA' | 'READY';

let data: { config: Config, presets: PresetInfo[], media: MediaLibrary[] } | undefined = undefined;

/**
 * Start up the server
 *
 * 1. Load the config
 * 2. Load presets
 * 3. Scan media libraries
 */
export async function loadData() {
  log.write('Begin data load');
  // Delete previous data
  data = undefined;

  const config = await getConfig();
  const presets = await findPresets(config.handbrake.presets);
  const media = await Promise.all(
    config.libraries.map((library, id) =>
      scanLibrary(
        id,
        library.name,
        library.staging,
        library.production,
        presets,
      ),
    ),
  );
  data = { config, presets, media };
  log.write('All media libraries loaded');
  return data;
}

/**
 * Return all the server's data
 */
export async function getData() {
  // FIXME: potential race condition if data loading is triggered twice
  return data ?? await loadData();
}
