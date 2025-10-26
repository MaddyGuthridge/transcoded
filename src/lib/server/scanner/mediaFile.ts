import fs from 'node:fs/promises';
import path from "node:path";
import type { EncodingInfo, MediaFile } from "./types";
import { fileIsMedia, removeFileExtension } from './helpers';
// import * as mkv from '../mkvWrapper';

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

  // const itemStagingFile = path.join(stagingRoot, itemPath, mediaFile);
  
  return {
    path: mediaFile,
    encodings: await findEncodings(
      productionFileDir,
      encodingPresets,
      itemTitle,
    ),
    // availableSubtitles: await mkv.findSubtitleTracks(itemStagingFile),
  };
}

/**
 * Find completed encodings of the given item file
 */
export async function findEncodings(
  productionFileDir: string,
  encodingPresets: string[],
  itemTitle: string,
): Promise<EncodingInfo[]> {
  if (! await fs.exists(productionFileDir)) {
    return [];
  }
  const mediaFiles = (await fs.readdir(productionFileDir, { withFileTypes: true }))
    .filter(dirEnt => fileIsMedia(dirEnt))
    .map(dirEnt => dirEnt.name);
  return encodingPresets
    .map(preset => {
      const regex = new RegExp(`^${itemTitle} \\- \\[${preset}\\]\\.`);
      const match = mediaFiles.find(f => regex.test(f));
      if (match) {
        // A match was found for this preset
        return { filename: match, preset };
      } else {
        // It hasn't been encoded to this preset yet
        return undefined;
      }
    })
    .filter(info => info !== undefined);
}
