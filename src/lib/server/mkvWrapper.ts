import { execa } from "execa"
import type { EmbeddedSubtitleInfo } from "./scanner/types"

type MkvSubtitleTrack = {
  id: number
  type: 'subtitles',
  properties: {
    /** Three-letter language code (eg "eng") */
    language: string,
    /** Track name, if provided */
    track_name?: string,
  }
}

type MkvAudioTrack = {
  id: number,
  type: 'audio',
}

type MkvVideoTrack = {
  id: number,
  type: 'video',
}

/**
 * Partial type definition for the output of
 * `mkvmerge --identification-format json --identify [file]`
 */
type MkvIdentification = {
  tracks: (MkvVideoTrack | MkvAudioTrack | MkvSubtitleTrack)[],
}

export async function findSubtitleTracks(file: string): Promise<EmbeddedSubtitleInfo[]> {
  const process = await execa(
    'mkvmerge',
    [
      '--identification-format',
      'json',
      '--identify',
      file,
    ]
  );
  const identity = JSON.parse(process.stdout) as MkvIdentification;

  return identity.tracks
    .filter(track => track.type === "subtitles")
    .map(track => ({
      id: track.id,
      language: parseLanguageCode(track.properties.language),
      name: track.properties.track_name ?? undefined,
    }));
}

/**
 * Parse the given language string from mkv tracks into a language code
 */
function parseLanguageCode(lang: string): string {
  if (lang === "eng") {
    return "en";
  }
  return lang;
}
