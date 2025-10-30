import { zodParse } from '$lib/components/helpers';
import { error, type Cookies } from '@sveltejs/kit';
import { getConfig } from './config';
import * as z from 'zod';
import { nanoid } from 'nanoid';

/** Store sessions in-memory. Restarting the server will revoke all sessions */
const sessions: string[] = [];

/** Log in, producing a new session */
export async function login(username: string, password: string, cookies: Cookies) {
  if (!await validateCredentials(username, password)) {
    error(401, 'Invalid credentials');
  }
  const sessionId = nanoid();
  cookies.set('sessionId', sessionId, { path: '/' });
  return sessionId;
}

/** Validate the given session */
export function validateSession(sessionId: string) {
  if (!sessions.includes(sessionId)) {
    error(401, 'Invalid session');
  }
}

/** Revoke the given session */
export function revokeSession(sessionId: string) {
  const idx = sessions.findIndex(s => s === sessionId);
  sessions.splice(idx, 1);
}

/**
 * How long to wait (in ms) before notifying the user that their login attempt
 * was rejected.
 */
const FAIL_DURATION = 100;

/**
 * Promise that resolves in a random amount of time, used to get some timing
 * invariance.
 */
const sleepRandom = () => new Promise<void>(r => void setTimeout(r, Math.random() * FAIL_DURATION));

async function validateCredentials(username: string, password: string) {
  const auth = await getAuthConfig();
  if (auth === null) {
    return true;
  }
  if (username in auth && auth[username] === password) {
    return true;
  } else {
    await sleepRandom();
    return false;
  }
}

const AuthConfig = z.record(z.string(), z.string());
type AuthConfig = z.Infer<typeof AuthConfig>;

export async function getAuthConfig(): Promise<AuthConfig | null> {
  const config = await getConfig();
  if (!config.auth) {
    return null;
  }
  return zodParse(AuthConfig, await Bun.file(config.auth).json());
}
