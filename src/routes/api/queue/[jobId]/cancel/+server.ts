import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import * as queue from '$lib/server/queue';
import { zodParse } from '$lib/components/helpers';
import * as z from 'zod';

export function DELETE(req: RequestEvent) {
  const jobId = zodParse(z.int(), parseInt(req.params.jobId));
  if (!queue.getQueue().find(job => job.id === jobId)) {
    error(400, 'Invalid job ID');
  }
  queue.cancel(jobId);
  return json(queue.getQueue());
}
