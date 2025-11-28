import { error } from '@sveltejs/kit';
import type { AuthManager } from './interface';

export class DummyAuth implements AuthManager {
  validSession = 'testing token';

  login(_username: string, _password: string): Promise<string> {
    return Promise.resolve(this.validSession);
  }

  validate(session: string): Promise<void> {
    if (session === this.validSession) {
      return Promise.resolve();
    } else {
      error(401, 'Invalid session');
    }
  }

  logout(_session: string): Promise<void> {
    return Promise.resolve();
  }

  logoutAll(): Promise<void> {
    return Promise.resolve();
  }
}
