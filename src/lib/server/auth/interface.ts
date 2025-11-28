/**
 * An authentication manager.
 *
 * Classes implementing this type should implement authentication.
 */
export type AuthManager = {
  /** Given a username and password, validate it and return a session token. */
  login(username: string, password: string): Promise<string>,

  /**
   * Given a session, validate its correctness, then resolve. Otherwise, reject.
   */
  validate(session: string): Promise<void>,

  /** Given a session, invalidate it. */
  logout(session: string): Promise<void>,

  /** Invalidate all sessions. */
  logoutAll(session: string): Promise<void>,
};
