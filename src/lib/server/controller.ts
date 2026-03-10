import { todo } from '$lib/util';
import type { AuthManager } from './auth';
import type { HandbrakePreset } from './handbrakePresets';

/**
 * When should a job be queued.
 *
 * Now => cancel the active job, perform the action, then restart the previous job.
 * Next => add the action to the head of the job queue.
 * Later => add the action to the tail of the job queue.
 */
export type When = 'now' | 'next' | 'later';

export class TranscodedController {
  #auth: AuthManager;

  /**
   * Construct a new transcoded controller, using the given state directory.
   *
   * If data exists within the state, it is loaded. Otherwise, the state starts empty.
   */
  constructor(
    auth: AuthManager,
  ) {
    this.#auth = auth;
  }

  /**
   * Log into the controller, returning a session token.
   * @param username
   * @param password
   */
  login(username: string, password: string): Promise<string> {
    return this.#auth.login(username, password);
  }

  logout(session: string): Promise<void> {
    return this.#auth.logout(session);
  }

  logoutAll(session: string): Promise<void> {
    return this.#auth.logoutAll(session);
  }

  /**
   * Returns a list of all libraries within Transcoded.
   *
   * @param session session ID for authentication.
   */
  async getLibraries(session: string) {
    await this.#auth.validate(session);
    todo();
  }

  /**
   * Returns a list of all media within Transcoded.
   *
   * @param session session ID for authentication.
   */
  async getMedia(session: string) {
    await this.#auth.validate(session);
    todo();
  }

  /**
   * Returns a list of all presets within Transcoded.
   *
   * @param session session ID for authentication.
   */
  async getPresets(session: string) {
    await this.#auth.validate(session);
    todo();
  }

  /**
   * Add a preset to Transcoded.
   *
   * @param session session ID for authentication.
   * @return preset ID
   */
  async addPreset(
    session: string,
    preset: HandbrakePreset,
  ): Promise<string> {
    await this.#auth.validate(session);
    void preset;
    todo();
  }

  /**
   * Update the given preset. This marks all current encodings using this preset as stale.
   *
   * @param session session ID for authentication.
   * @param presetId preset to update
   * @param preset preset data
   */
  async updatePreset(
    session: string,
    presetId: string,
    preset: HandbrakePreset,
  ) {
    await this.#auth.validate(session);
    void presetId;
    void preset;
    todo();
  }

  /**
   * Queue renaming an existing preset.
   *
   * @param session session ID for authentication.
   * @param when the positioning in the queue for this job.
   * @param presetId ID of the preset to rename.
   * @param name name of the preset to rename.
   * @return jobId
   */
  async qRenamePreset(
    session: string,
    when: When,
    presetId: string,
    name: string,
  ): Promise<string> {
    await this.#auth.validate(session);
    void when;
    void presetId;
    void name;
    todo();
  }

  /**
   * Remove an existing preset.
   *
   * @param session session ID for authentication.
   * @param when the positioning in the queue for this job.
   * @param presetId preset to remove.
   * @param options how to handle existing encodings.
   * @return jobId
   */
  async qRemovePreset(
    session: string,
    when: When,
    presetId: string,
    options: {
      mode: 'migrate',
      toPreset: string,
    } | {
      mode: 'delete',
    } | {
      mode: 'ignore',
    },
  ): Promise<string> {
    await this.#auth.validate(session);
    void when;
    void presetId;
    void options;
    todo();
  }

  /**
   * Register a library to use within transcoded.
   *
   * This also triggers a scan of that library.
   *
   * @param session session ID for authentication.
   * @param name name of the library.
   * @param stagingRoot root of the library's staging directory.
   * @param productionRoot root of the library's production directory.
   * @return libraryId
   */
  async registerLibrary(
    session: string,
    name: string,
    stagingRoot: string,
    productionRoot: string,
  ): Promise<string> {
    await this.#auth.validate(session);
    void name;
    void stagingRoot;
    void productionRoot;
    todo();
  }

  /**
   * Deregister a library from transcoded.
   *
   * All jobs involving this library that are located after this job will be cancelled.
   *
   * Notably, this does not delete the library from the file system.
   *
   * @param session session ID for authentication.
   * @param libraryId the ID of the library to deregister.
   */
  async deregisterLibrary(session: string, libraryId: string) {
    await this.#auth.validate(session);
    void libraryId;
    todo();
  }

  /**
   * Given a library ID, edit the corresponding library's properties.
   *
   * All upcoming move jobs involving this library will be cancelled.
   *
   * If the file paths for the staging or production root are changed, that library will be
   * re-scanned.
   *
   * @param session session ID for authentication.
   * @param libraryId the ID of the library to edit.
   * @param newStagingRoot the new staging root of the library.
   * @param newProductionRoot the new production root of the library.
   * @return jobId
   */
  async locateLibrary(
    session: string,
    libraryId: string,
    newStagingRoot: string,
    newProductionRoot: string,
  ): Promise<string> {
    await this.#auth.validate(session);
    void libraryId;
    void newStagingRoot;
    void newProductionRoot;
    todo();
  }

  /**
   * Scan a single media library.
   *
   * @param session session ID for authentication.
   * @param libraryId the ID of the library to scan.
   */
  async scanLibrary(session: string, libraryId: string) {
    await this.#auth.validate(session);
    void libraryId;
    todo();
  }

  /**
   * Scan all media libraries.
   *
   * @param session session ID for authentication.
   */
  async scanAllLibraries(session: string) {
    await this.#auth.validate(session);
    todo();
  }

  /**
   * Given a library ID, queue a move of the library's contents.
   *
   * All upcoming edit and move jobs involving this library will be cancelled.
   *
   * @param session session ID for authentication.
   * @param when the positioning in the queue for this job.
   * @param libraryId the ID of the library to move.
   * @param newStagingRoot the new staging root of the library.
   * @param newProductionRoot the new production root of the library.
   * @return jobId
   */
  async qMoveLibrary(
    session: string,
    when: When,
    libraryId: string,
    newStagingRoot: string,
    newProductionRoot: string,
  ): Promise<string> {
    await this.#auth.validate(session);
    void when;
    void libraryId;
    void newStagingRoot;
    void newProductionRoot;
    todo();
  }

  /**
   * Queue moving a media item to a different library.
   *
   * @param session session ID for authentication.
   * @param when the positioning in the queue for this job.
   * @param mediaId the ID of the media to move.
   * @param libraryId the ID of the library to move to.
   * @return jobId
   */
  async qMoveMediaToLibrary(
    session: string,
    when: When,
    mediaId: string,
    targetLibraryId: string,
  ): Promise<string> {
    await this.#auth.validate(session);
    void mediaId;
    void targetLibraryId;
    todo();
  }

  /**
   * Queue renaming a media item.
   *
   * @param session session ID for authentication.
   * @param when the positioning in the queue for this job.
   * @param mediaId the ID of the media to rename.
   * @param newName the new name to give the media.
   * @return jobId
   */
  async qRenameMedia(
    session: string,
    when: When,
    mediaId: string,
    newName: string,
  ): Promise<string> {
    await this.#auth.validate(session);
    void when;
    void mediaId;
    void newName;
    todo();
  }

  /**
   * Deregister a missing media item from the library.
   *
   * Cancels any operations involving this media that are queued after this job.
   *
   * @param session session ID for authentication.
   * @param mediaId the ID of the media to deregister.
   */
  async deregisterMedia(session: string, mediaId: string) {
    await this.#auth.validate(session);
    void mediaId;
    todo();
  }

  /**
   * Queue renaming a media file.
   *
   * Cancels any queued renames of this file.
   *
   * @param session session ID for authentication.
   * @param when the positioning in the queue for this job.
   * @param mediaId the ID of the media to which this file belongs.
   * @param oldFile the current filename
   * @param newFile the new file name, which the file will be renamed to.
   * @return jobId
   */
  async qMoveFile(
    session: string,
    when: When,
    mediaId: string,
    oldFile: string,
    newFile: string,
  ): Promise<string> {
    await this.#auth.validate(session);
    void when;
    void mediaId;
    void oldFile;
    void newFile;
    todo();
  }

  /**
   * Cancel an active or queued job.
   *
   * @param session session ID for authentication.
   * @param jobId ID of job to cancel.
   */
  async cancelJob(session: string, jobId: string) {
    await this.#auth.validate(session);
    void jobId;
    todo();
  }

  /**
   * Configure whether the worker should auto-start.
   *
   * @param session session ID for authentication.
   * @param autoStart whether the worker should automatically start when new jobs are added.
   */
  async autoStartWorker(session: string, autoStart: boolean) {
    await this.#auth.validate(session);
    void autoStart;
    todo();
  }

  /**
   * Start the worker.
   *
   * @param session session ID for authentication.
   */
  async startWorker(session: string) {
    await this.#auth.validate(session);
    todo();
  }

  /**
   * Step the worker, causing it to complete one job, and then stop.
   *
   * @param session session ID for authentication.
   */
  async stepWorker(session: string) {
    await this.#auth.validate(session);
    todo();
  }

  /**
   * Stop the worker.
   *
   * @param session session ID for authentication.
   * @param now whether to stop the worker immediately (true), or wait for the current job to
   * finish (false).
   *
   * Returns when the stop has been requested. This doesn't necessarily mean that the worker has
   * stopped yet. Use `workerStopped` to wait until the worker has properly stopped.
   */
  async stopWorker(session: string, now: boolean) {
    await this.#auth.validate(session);
    void now;
    todo();
  }

  /**
   * Stop the worker and immediately restart it.
   *
   * @param session session ID for authentication.
   */
  async restartWorker(session: string) {
    await this.#auth.validate(session);
    todo();
  }

  /**
   * Wait for the worker to stop, and then resolve.
   *
   * @param session session ID for authentication.
   */
  async workerStopped(session: string): Promise<void> {
    await this.#auth.validate(session);
    todo();
  }
}
