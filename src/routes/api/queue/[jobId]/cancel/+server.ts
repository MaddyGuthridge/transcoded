import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import * as queue from '$lib/server/queue';
import { zodParse } from '$lib/components/helpers';
import * as z from 'zod';

export function DELETE(req: RequestEvent) {
  const jobId = zodParse(z.int(), parseInt(req.params.jobId));
  const job = queue.getQueue().find(job => job.id === jobId);
  if (!job) {
    error(400, 'Invalid job ID');
  }

  if (['Complete', 'Failed', 'Canceled'].includes(job.status)) {
    error(400, 'Cannot cancel an already resolved job');
  }

  queue.cancel(jobId);
  return json(queue.getQueue());
}
