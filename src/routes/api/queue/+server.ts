import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { getQueue } from '$lib/server/queue';

export function GET(_req: RequestEvent) {
  return json(getQueue());
}
