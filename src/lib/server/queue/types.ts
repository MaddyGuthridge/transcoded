export type JobStatus = 'Queued' | 'Canceled' | 'Working' | 'Complete' | 'Failed';

export type JobBase = {
  /** Job ID */
  id: number,
  type: string,
  /** Status of the job */
  status: JobStatus,
  /** Logs produced by the job */
  logs: string[],
  /** Latest progress info */
  progress: {
    percent: number,
    fps: {
      current: number,
      average: number,
    } | null,
    eta: {
      hours: number,
      minutes: number,
      seconds: number,
    } | null,
  },
};

export type TranscodeJob = JobBase & {
  /** Job type */
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

export type Job = TranscodeJob;
