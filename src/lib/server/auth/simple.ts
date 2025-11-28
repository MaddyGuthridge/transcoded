import { zodParse } from '$lib/components/helpers';
import { error } from '@sveltejs/kit';
import * as z from 'zod';
import { nanoid } from 'nanoid';
import type { AuthManager } from './interface';

const AuthConfig = z.record(z.string(), z.string());
type AuthConfig = z.Infer<typeof AuthConfig>;

export class SimpleAuth implements AuthManager {
  #config: AuthConfig;

  /** Store sessions in-memory. Restarting the server will revoke all sessions */
  #sessions: string[] = [];

  constructor(config: AuthConfig) {
    this.#config = config;
  }

  /** Construct a new SimpleAuth */
  static async new(configFile: string) {
    const cfg = zodParse(AuthConfig, await Bun.file(configFile).json());
    return new SimpleAuth(cfg);
  }

  async login(username: string, password: string): Promise<string> {
    if (username in this.#config && this.#config[username] === password) {
      const sessionId = nanoid();
      this.#sessions.push(sessionId);
      return sessionId;
    } else {
      await sleepRandom();
      error(401, 'Invalid credentials');
    }
  }

  async validate(session: string): Promise<void> {
    if (this.#sessions.includes(session)) {
      return;
    } else {
      await sleepRandom();
      error(401, 'Session token is invalid');
    }
  }

  async logout(session: string): Promise<void> {
    if (this.#sessions.includes(session)) {
      this.#sessions = this.#sessions.filter(s => s !== session);
    } else {
      await sleepRandom();
      error(401, 'Session token is invalid');
    }
  }

  async logoutAll(session: string): Promise<void> {
    await this.validate(session);
    this.#sessions = [];
    return;
  }
}

/**
 * How long to wait on average (in ms) before notifying the user that their login attempt
 * was rejected.
 */
const FAIL_DURATION = 100;

/**
 * Promise that resolves in a random amount of time, used to get some timing
 * invariance.
 */
const sleepRandom = () => new Promise<void>(
  r => void setTimeout(r, Math.random() * FAIL_DURATION + FAIL_DURATION / 2));
