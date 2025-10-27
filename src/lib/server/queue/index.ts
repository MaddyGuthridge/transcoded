import { handbrake } from '../handbrakeWrapper';
import type { TranscodeJob } from './types';
import { ExecaError } from 'execa';

const threads = 2;

let nextId = 0;
let workerController: AbortController | null = null;

const queue: { id: number, task: TranscodeJob }[] = [];

export function enqueue(task: TranscodeJob) {
  const id = nextId++;
  queue.push({ id, task });
  if (!workerController) {
    void startWorker();
  }
  return id;
}

/** Cancel a queued operation */
export function cancel(id: number) {
  const idx = queue.findIndex(t => t.id === id);
  if (idx === 0 && workerController) {
    // Cancel operation
    workerController.abort();
  }
  queue.splice(idx, 1);
}

/** Return whether the worker is currently running */
export function running() {
  return workerController !== null;
}

async function startWorker() {
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
  while (queue.length) {
    const job = queue[0];
    switch (job.task.type) {
      case 'transcode':
        await transcodeJob(job.task, abort);
        break;
      default:
        throw new Error(`Unknown job type: ${job.task.type}`);
    }
    queue.shift();
  }
}

async function transcodeJob(job: TranscodeJob, abort: AbortSignal) {
  await handbrake(
    job.input,
    job.output,
    job.preset,
    threads,
    abort,
    progress => console.log(progress),
  );
}
