import { getData } from '$lib/server';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export async function GET(_req: RequestEvent) {
  return json(await getData());
}
