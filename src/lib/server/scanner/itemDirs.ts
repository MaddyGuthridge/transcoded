import fs from 'node:fs/promises';
import path from 'node:path';
import { fileIsMedia } from './helpers';

/**
 * Given the a staging root, find all media item directories.
 * 
 * Each item is returned as a directory path relative to `stagingRoot`
 */
export async function findMediaItemDirs(stagingRoot: string): Promise<string[]> {
  // All queue entries should be relative to `stagingRoot`
  const queue: string[] = (await fs.readdir(stagingRoot, { withFileTypes: true }))
    .filter(dirEnt => dirEnt.isDirectory())
    .map(dirEnt => dirEnt.name);

  const mediaItems: string[] = [];

  while (queue.length) {
    const dir = queue.shift()!;
    const absoluteDir = path.join(stagingRoot, dir);
    if (await dirIsMediaItem(absoluteDir)) {
      mediaItems.push(dir);
    } else {
      const files = await fs.readdir(absoluteDir, { withFileTypes: true });
      for (const f of files) {
        if (f.isDirectory()) {
          queue.push(path.join(dir, f.name));
        }
      }
    }
  }
  return mediaItems;
}

/**
 * Given a directory's path, return whether it contains media, indicating that it is a
 * media root file.
 */
async function dirIsMediaItem(dir: string): Promise<boolean> {
  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const f of files) {
    if (fileIsMedia(f)) {
      return true;
    }
  }
  return false;
}
