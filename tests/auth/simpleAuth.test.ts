import { SimpleAuth } from '$lib/server/auth';
import { describe, expect, it } from 'bun:test';

describe('login', () => {
  // These concurrent tests don't actually work due to
  // https://github.com/oven-sh/bun/issues/25181
  // My brain is melting.
  it.concurrent('accepts valid credentials', () => {
    const auth = new SimpleAuth({ maddy: 'abc123ABC' });

    expect(auth.login('maddy', 'abc123ABC'))
      .resolves.toStrictEqual(expect.any(String));
  });

  it.concurrent('rejects incorrect usernames', () => {
    const auth = new SimpleAuth({ maddy: 'abc123ABC' });

    expect(auth.login('not maddy', 'abc123ABC'))
      .rejects.toMatchObject({ status: 401 });
  });

  it.concurrent('rejects incorrect passwords', () => {
    const auth = new SimpleAuth({ maddy: 'abc123ABC' });

    expect(auth.login('maddy', 'wrong password'))
      .rejects.toMatchObject({ status: 401 });
  });
});

describe('validate', () => {
  it.concurrent('accepts valid sessions', async () => {
    const auth = new SimpleAuth({ maddy: 'abc123ABC' });

    const session = await auth.login('maddy', 'abc123ABC');

    expect(auth.validate(session))
      .resolves.toBeUndefined();
  });

  it.concurrent('rejects invalid sessions', () => {
    const auth = new SimpleAuth({ maddy: 'abc123ABC' });

    const session = 'invalid';

    expect(auth.validate(session))
      .rejects.toMatchObject({ status: 401 });
  });
});

describe('logout', () => {
  it.concurrent('invalidates valid tokens', async () => {
    const auth = new SimpleAuth({ maddy: 'abc123ABC' });

    const session = await auth.login('maddy', 'abc123ABC');

    expect(auth.logout(session))
      .resolves.toBeUndefined();

    // Session should now be invalid
    expect(auth.validate(session))
      .rejects.toMatchObject({ status: 401 });
  });

  it.concurrent('rejects invalid sessions', () => {
    const auth = new SimpleAuth({ maddy: 'abc123ABC' });

    const session = 'invalid';

    expect(auth.logout(session))
      .rejects.toMatchObject({ status: 401 });
  });
});

describe('logoutAll', () => {
  it.concurrent('invalidates valid tokens', async () => {
    const auth = new SimpleAuth({ maddy: 'abc123ABC' });

    const session = await auth.login('maddy', 'abc123ABC');
    const session2 = await auth.login('maddy', 'abc123ABC');

    expect(auth.logoutAll(session))
      .resolves.toBeUndefined();

    // Session should now be invalid
    expect(auth.validate(session))
      .rejects.toMatchObject({ status: 401 });
    // So should session 2
    expect(auth.validate(session2))
      .rejects.toMatchObject({ status: 401 });
  });

  it.concurrent('rejects invalid sessions', () => {
    const auth = new SimpleAuth({ maddy: 'abc123ABC' });

    const session = 'invalid';

    expect(auth.logoutAll(session))
      .rejects.toMatchObject({ status: 401 });
  });
});
