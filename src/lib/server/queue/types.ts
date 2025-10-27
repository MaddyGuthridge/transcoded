export type TranscodeJob = {
  type: 'transcode',
  /** Path to input file */
  input: string,
  /** Path to output file */
  output: string,
  /** Handbrake preset to use */
  preset: {
    /** Preset file */
    file: string,
    /** Preset name */
    name: string,
  },
};
