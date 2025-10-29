import { ExecaError } from 'execa';
import fs from 'node:fs/promises';
import { handbrake, type HandbrakeProgressEvent } from '../handbrakeWrapper';
import { nextJob } from '.';
import type { TranscodeJob } from './types';
import path from 'node:path';

let workerController: AbortController | null = null;

/** Return whether the worker is currently running */
export function running() {
  return workerController !== null;
}

/** Stop the worker */
export function stop() {
  if (workerController) {
    workerController.abort();
  }
}

/** Start the worker */
export async function start() {
  workerController = new AbortController();
  try {
    await doWork(workerController.signal);
  } catch (e) {
    if (e instanceof ExecaError) {
      if (e.isCanceled) {
        console.log('Worker was cancelled');
      } else {
        console.log(e);
      }
    } else {
      throw e;
    }
  }
  workerController = null;
}

async function doWork(abort: AbortSignal) {
  let job = nextJob();
  while (job !== null) {
    try {
      switch (job.type) {
        case 'transcode':
          await transcodeJob(job, abort);
          break;
        default:
          throw new Error(`Unknown job type: ${job.type}`);
      }
    } catch (e) {
      job.status = 'Failed';
      throw e;
    }
    job = nextJob();
  }
}

/** Run a transcoding job using Handbrake */
async function transcodeJob(job: TranscodeJob, abort: AbortSignal) {
  // Create parent directory first
  await fs.mkdir(path.dirname(job.output), { recursive: true });

  /** Callback for when progress has been made */
  function onProgress(progress: HandbrakeProgressEvent) {
    if ('percent' in progress) {
      job.progress.percent = progress.percent;
    }
    if ('eta' in progress) {
      job.progress.eta = progress.eta;
      job.progress.fps = progress.fps;
    }
  }
  /** Callback for when a log entry was produced */
  function onLog(message: string) {
    job.logs.push(message);
  }

  job.status = 'Working';
  await handbrake(
    job.input,
    job.output,
    job.preset,
    abort,
    onProgress,
    onLog,
  );
  job.status = 'Complete';
  job.progress.percent = 100;
  job.progress.eta = null;
  job.progress.fps = null;
}
