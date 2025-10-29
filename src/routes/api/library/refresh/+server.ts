import { getData, loadData } from '$lib/server';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export async function POST(_req: RequestEvent) {
  await loadData();
  return json(await getData());
}
