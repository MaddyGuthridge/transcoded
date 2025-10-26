import path from 'node:path';
import type { Dirent } from "node:fs";

export const mediaFormats = [
  'mkv',
  'mp4',
]

/** Return whether a file is a media file */
export function fileIsMedia(f: Dirent<string>): boolean {
  return f.isFile()
    && mediaFormats.includes(path.extname(f.name));
}

/** Remove the file extension from the given filename */
export function removeFileExtension(f: string): string {
  // https://stackoverflow.com/a/4250408/6335363
  return f.replace(/\.[^/.]+$/, "");
}
