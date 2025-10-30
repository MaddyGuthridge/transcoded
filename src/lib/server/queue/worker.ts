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
    console.log(e);
  }
  workerController = null;
}

async function doWork(abort: AbortSignal) {
  let job = nextJob();
  while (job !== null) {
    switch (job.type) {
      case 'transcode':
        await transcodeJob(job, abort);
        break;
      default:
        throw new Error(`Unknown job type: ${job.type}`);
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

  const partialFile = `${job.output}.part`;

  job.status = 'Working';
  try {
    await handbrake(
      job.input,
      partialFile,
      job.preset,
      abort,
      onProgress,
      onLog,
    );
  } catch (e) {
    // Remove partial file
    await fs.unlink(partialFile);
    if (e instanceof ExecaError && e.isCanceled) {
      console.log('Worker was cancelled');
      job.status = 'Canceled';
    } else {
      job.status = 'Failed';
    }
    throw e;
  }
  await fs.rename(partialFile, job.output);
  job.status = 'Complete';
  job.progress.percent = 100;
  job.progress.eta = null;
  job.progress.fps = null;
}
