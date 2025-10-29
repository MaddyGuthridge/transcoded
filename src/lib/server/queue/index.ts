import type { TranscodeJob, Job } from './types';
import * as worker from './worker';

let nextId = 0;

export type Queue = Job[];

const queue: Queue = [];

export function enqueueTranscode(input: string, output: string, preset: { file: string, name: string }) {
  const id = nextId++;
  const job: TranscodeJob = {
    id,
    type: 'transcode',
    status: 'Queued',
    input,
    output,
    preset,
    logs: [],
    progress: {
      percent: 0,
      fps: null,
      eta: null,
    },
  };
  queue.push(job);
  if (!worker.running()) {
    void worker.start();
  }
  return id;
}

/** Cancel a queued operation */
export function cancel(id: number) {
  const job = queue.find(t => t.id === id)!;
  if (worker.running()) {
    // Cancel operation
    worker.stop();
    void worker.start();
  }
  job.status = 'Canceled';
}

/** Return a reference to the next job in the queue */
export function nextJob(): Job | null {
  return queue.find(job => job.status === 'Queued') ?? null;
}

/** Return the full queue */
export function getQueue() {
  return queue;
}
