import { getData } from '$lib/server';

export function load(_req: import('./$types').RequestEvent) {
  return getData();
}
