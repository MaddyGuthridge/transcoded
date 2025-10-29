import { browser } from '$app/environment';
import type { Data } from './server';
import type { Queue } from './server/queue';

const SERVER_URL = browser ? document.location.host : 'TODO';

export async function getData(): Promise<Data> {
  const res = await fetch(`${SERVER_URL}/api/library`);
  return await res.json();
}

export async function getQueue(): Promise<Queue> {
  const res = await fetch(`${SERVER_URL}/api/queue`);
  return await res.json();
}
