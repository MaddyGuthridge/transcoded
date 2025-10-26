/** Type definitions for media library scanner */

/** Subtitle track embedded into media */
export type EmbeddedSubtitleInfo = {
  /** MKV track ID */
  id: number
  /** Subtitle track language, as an IETF language tag */
  language: string
  /** The name of the subtitle track, if present */
  name: string | undefined
}

export type ExtractedSubtitleInfo = {
  /** Subtitle track language, as an IETF language tag */
  language: string
  /** Subtitle file type (eg "srt") */
  file: string
  /** The name of the subtitle track, if present */
  name: string | undefined
}

/**
 * A single staging file, a part of a media item.
 * 
 * This contains information about the original, as well as its encodings and subtitle rips.
 */
export type MediaFile = {
  /** 
   * The path to this media file's original, relative to the root of the media item.
   * 
   * For example `Barbie-SEG_MainFeature_t07.mkv`
   */
  path: string,
  /** A list of all the produced encodings of the media file */
  encodings: string[],
  /** 
   * Extracted subtitles for this item.
   * 
   * For example, if only English subtitles have been extracted, this would be `['en']`.
   */
  extractedSubtitles: ExtractedSubtitleInfo[],
  /**
   * List of available subtitles, generated from `mkvinfo`.
   */
  availableSubtitles: EmbeddedSubtitleInfo[],
}

/**
 * A media item (eg a single movie, or episode of a show)
 */
export type MediaItem = {
  /** Path to the media item's directory */
  path: string,
  /** Title of the media */
  title: string,
  /** Main media file. If there is no clear main feature, then this is `undefined`. */
  mainFile: MediaFile | undefined,
  /** All media files associated with this item. */
  files: MediaFile[],
};

/**
 * The full media library. A list of media items.
 */
export type Library = MediaItem[];
