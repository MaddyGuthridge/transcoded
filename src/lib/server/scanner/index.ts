/**
 * Media scanner.
 *
 * Finds all media, and scans for
 */

import { findMediaItemDirs } from './itemDirs';
import { parseMediaItem } from './mediaItem';

/**
 * Scan a media library, given its root directories.
 */
export async function scanLibrary(
  stagingRoot: string,
  productionRoot: string,
  encodingPresets: string[],
) {
  const mediaItemDirs = await findMediaItemDirs(stagingRoot);

  return Promise.all(mediaItemDirs.map(item => parseMediaItem(
    stagingRoot,
    productionRoot,
    encodingPresets,
    item,
  )));
}
