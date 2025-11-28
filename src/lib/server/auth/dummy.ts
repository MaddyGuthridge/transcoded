import type { AuthManager } from './interface';

export class DummyAuth implements AuthManager {
  login(_username: string, _password: string): Promise<string> {
    return Promise.resolve('testing token');
  }

  validate(_session: string): Promise<void> {
    return Promise.resolve();
  }

  logout(_session: string): Promise<void> {
    return Promise.resolve();
  }

  logoutAll(): Promise<void> {
    return Promise.resolve();
  }
}
