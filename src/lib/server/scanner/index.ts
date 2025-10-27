/**
 * Media scanner.
 *
 * Finds all media, and scans for
 */

import type { PresetInfo } from '../handbrakePresets';
import { findMediaItemDirs } from './itemDirs';
import { parseMediaItem } from './mediaItem';
import type { MediaLibrary } from './types';

/**
 * Scan a media library, given its root directories.
 */
export async function scanLibrary(
  libraryId: number,
  name: string,
  stagingRoot: string,
  productionRoot: string,
  encodingPresets: PresetInfo[],
): Promise<MediaLibrary> {
  const mediaItemDirs = await findMediaItemDirs(stagingRoot);

  const items = await Promise.all(
    mediaItemDirs.map((item, i) => parseMediaItem(
      i,
      stagingRoot,
      productionRoot,
      encodingPresets,
      item,
    )),
  );

  return {
    id: libraryId,
    name,
    stagingRoot,
    productionRoot,
    items,
  };
}
