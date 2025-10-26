import type { MediaItem } from "./types";
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileIsMedia } from "./helpers";
import type { Dirent } from "node:fs";
import { parseMediaFile } from "./mediaFile";

/**
 * Parse information about the given media item
 */
export async function parseMediaItem(
  stagingRoot: string,
  productionRoot: string,
  encodingPresets: string[],
  itemPath: string,
): Promise<MediaItem> {
  const title = path.basename(itemPath);
  const mediaFiles = (await fs.readdir(itemPath, { withFileTypes: true, recursive: true }))
    .filter(dirEnt => fileIsMedia(dirEnt));
  const mainFeature = await determineMainFeature(itemPath, mediaFiles);
  const otherFiles = mediaFiles
    .map(dirEnt => path.join(dirEnt.parentPath, dirEnt.name))
    .filter(f => f !== mainFeature);

  return {
    path: itemPath,
    title,
    mainFile: mainFeature
      ? await parseMediaFile(
        stagingRoot,
        productionRoot,
        encodingPresets,
        itemPath,
        mainFeature,
        title,
        true,
      )
      : undefined,
    files: await Promise.all(
      otherFiles.map(async f => await parseMediaFile(
        stagingRoot,
        productionRoot,
        encodingPresets,
        itemPath,
        f,
        title,
        false,
      ))
    ),
  };
}

/**
 * Determines the main feature of the given item path.
 *
 * - If a single media item includes the string `MainFeature` in its file path, it will be the main
 *   feature, regardless of other directory contents.
 * - Otherwise, if there is only one file in the top directory, it is considered the main feature.
 * - Otherwise, the main feature is undecidable.
 */
async function determineMainFeature(
  itemPath: string,
  mediaFiles: Dirent<string>[],
): Promise<string | undefined> {
  const mainFeatureRegex = /MainFeature/;
  const mainFeatures: string[] = [];
  const filesInRoot: string[] = [];
  for (const f of mediaFiles) {
    if (mainFeatureRegex.test(f.name) || mainFeatureRegex.test(f.parentPath)) {
      // Contains 'MainFeature';
      mainFeatures.push(path.join(f.parentPath, f.name));
    } else if (f.parentPath === itemPath) {
      // Is in directory root
      filesInRoot.push(f.name);
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
