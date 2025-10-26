import fs from 'node:fs/promises';
import path from "node:path";
import type { MediaFile } from "./types";
import { fileIsMedia, removeFileExtension } from './helpers';

/**
 * Determine information about the given media file.
 */
export async function parseMediaFile(
  stagingRoot: string,
  productionRoot: string,
  encodingPresets: string[],
  itemPath: string,
  mediaFile: string,
  itemTitle: string,
  isMainFeature: boolean,
): Promise<MediaFile> {
  const productionItemPath = path.join(productionRoot, itemPath);
  const productionFileDir = isMainFeature
    ? productionItemPath
    : path.join(productionItemPath, 'extras', removeFileExtension(mediaFile));

  return {
    path: mediaFile,
    encodings: await findEncodings(
      productionFileDir,
      encodingPresets,
      itemTitle,
    ),
    extractedSubtitles: [],
    availableSubtitles: [],
  };
}

/**
 * Find completed encodings of the given item file
 */
export async function findEncodings(
  productionFileDir: string,
  encodingPresets: string[],
  itemTitle: string,
): Promise<string[]> {
  if (! await fs.exists(productionFileDir)) {
    return [];
  }
  const mediaFiles = (await fs.readdir(productionFileDir, { withFileTypes: true }))
    .filter(dirEnt => fileIsMedia(dirEnt))
    .map(dirEnt => dirEnt.name);
  return encodingPresets
    .filter(preset => {
      const regex = new RegExp(`^${itemTitle} \\- \\[${preset}\\]\\.`);
      return mediaFiles.find(f => regex.test(f)) !== undefined;
    });
}
