import type { MediaItem } from './types';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileIsMedia } from './helpers';
import { parseMediaFile } from './mediaFile';
import type { PresetInfo } from '../handbrakePresets';
import { enumerate } from '$lib/util';

/**
 * Parse information about the given media item
 */
export async function parseMediaItem(
  id: number,
  stagingRoot: string,
  productionRoot: string,
  encodingPresets: PresetInfo[],
  itemPath: string,
): Promise<MediaItem> {
  const itemStaging = path.join(stagingRoot, itemPath);
  const title = path.basename(itemPath);
  const mediaFiles = (await fs.readdir(itemStaging, { withFileTypes: true, recursive: true }))
    .filter(dirEnt => fileIsMedia(dirEnt))
    .map(dirEnt => path.relative(itemStaging, path.join(dirEnt.parentPath, dirEnt.name)));

  const mainFeature = determineMainFeature(itemStaging, mediaFiles);

  return {
    id,
    path: itemPath,
    title,
    mainFile: mainFeature,
    files: await Promise.all(
      mediaFiles.map((f, i) => parseMediaFile(
        i,
        stagingRoot,
        productionRoot,
        encodingPresets,
        itemPath,
        f,
        title,
        i === mainFeature,
      )),
    ),
  };
}

/**
 * Determines the main feature of the given item path, returning its index.
 *
 * - If a single media item includes the string `MainFeature` in its file path, it will be the main
 *   feature, regardless of other directory contents.
 * - Otherwise, if there is only one file in the top directory, it is considered the main feature.
 * - Otherwise, the main feature is undecidable.
 */
function determineMainFeature(
  itemStaging: string,
  mediaFiles: string[],
): number | undefined {
  const mainFeatureRegex = /main[\w\-_]?feature/;
  const mainFeatures: number[] = [];
  const filesInRoot: number[] = [];
  for (const [i, f] of enumerate(mediaFiles)) {
    if (mainFeatureRegex.test(f.toLowerCase())) {
      // Contains 'MainFeature';
      mainFeatures.push(i);
    } else if (path.dirname(f) === '.') {
      // Is in directory root
      filesInRoot.push(i);
    }
  }

  if (mainFeatures.length === 1) {
    return mainFeatures[0];
  } else if (filesInRoot.length === 1) {
    return filesInRoot[0];
  } else {
    return undefined;
  }
}
