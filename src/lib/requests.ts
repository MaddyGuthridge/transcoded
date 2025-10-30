import { browser } from '$app/environment';
import type { Data } from './server';
import type { Queue } from './server/queue';

const SERVER_URL = browser ? '' : 'TODO';

export async function getData(): Promise<Data> {
  const res = await fetch(`${SERVER_URL}/api/library`);
  return await res.json();
}

export async function reloadData(): Promise<Data> {
  const res = await fetch(
    `${SERVER_URL}/api/library/refresh`,
    { method: 'POST' },
  );
  return await res.json();
}

export async function getQueue(): Promise<Queue> {
  const res = await fetch(`${SERVER_URL}/api/queue`);
  return await res.json();
}

export async function cancelJob(jobId: number): Promise<Queue> {
  const res = await fetch(`${SERVER_URL}/api/queue/${jobId}/cancel`, { method: 'DELETE' });
  return await res.json();
}

export async function queueTranscoding(
  libraryId: number,
  itemId: number,
  fileId: number,
  presetId: number,
) {
  console.log({
    libraryId,
    itemId,
    fileId,
    presetId,
  });

  const res = await fetch(
    `${SERVER_URL}/api/queue/transcode`,
    {
      method: 'POST',
      body: JSON.stringify({
        libraryId,
        itemId,
        fileId,
        presetId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return await res.json();
}
