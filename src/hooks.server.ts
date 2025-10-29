import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import logger from './middleware/logger';
import { loadData } from '$lib/server';

const middleware: Handle[] = [];

middleware.push(logger());

export const handle = sequence(...middleware);

/** Called when the server starts */
async function onStartup() {
  await loadData();
}

void onStartup();
