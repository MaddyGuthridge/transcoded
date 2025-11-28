import { todo } from '$lib/util';
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
  #stateDir: string;

  /**
   * Construct a new transcoded controller, using the given state directory.
   *
   * If data exists within the state, it is loaded. Otherwise, the state starts empty.
   */
  constructor(stateDir: string) {
    this.#stateDir = stateDir;
  }

  /**
   * Log into the controller, returning a session token.
   * @param username
   * @param password
   */
  async login(username: string, password: string): Promise<string> {
    todo();
  }

  /**
   * Returns a list of all libraries within Transcoded.
   *
   * @param session session ID for authentication.
   */
  getLibraries(session: string) {
    todo();
  }

  /**
   * Returns a list of all media within Transcoded.
   *
   * @param session session ID for authentication.
   */
  getMedia(session: string) {
    todo();
  }

  /**
   * Returns a list of all presets within Transcoded.
   *
   * @param session session ID for authentication.
   */
  getPresets(session: string) {
    todo();
  }

  /**
   * Add a preset to Transcoded.
   *
   * @param session session ID for authentication.
   */
  async addPreset(
    session: string,
    preset: HandbrakePreset,
  ): string {
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
  qRenamePreset(
    session: string,
    when: When,
    presetId: string,
    name: string,
  ): string {
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
  qRemovePreset(
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
  ): string {
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
  deregisterLibrary(session: string, libraryId: string) {
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
  ): string {
    todo();
  }

  /**
   * Scan a single media library.
   *
   * @param session session ID for authentication.
   * @param libraryId the ID of the library to scan.
   */
  async scanLibrary(session: string, libraryId: string) {
    todo();
  }

  /**
   * Scan all media libraries.
   *
   * @param session session ID for authentication.
   */
  async scanAllLibraries(session: string) {
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
  qMoveLibrary(
    session: string,
    when: When,
    libraryId: string,
    newStagingRoot: string,
    newProductionRoot: string,
  ): string {
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
  qMoveMediaToLibrary(
    session: string,
    when: When,
    mediaId: string,
    targetLibraryId: string,
  ): string {
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
  qRenameMedia(
    session: string,
    when: When,
    mediaId: string,
    newName: string,
  ): string {
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
  deregisterMedia(session: string, mediaId: string) {
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
  qMoveFile(
    session: string,
    when: When,
    mediaId: string,
    oldFile: string,
    newFile: string,
  ): string {
    todo();
  }

  /**
   * Cancel an active or queued job.
   *
   * @param session session ID for authentication.
   * @param jobId ID of job to cancel.
   */
  cancelJob(session: string, jobId: string) {
    todo();
  }

  /**
   * Configure whether the worker should auto-start.
   *
   * @param session session ID for authentication.
   * @param autoStart whether the worker should automatically start when new jobs are added.
   */
  autoStartWorker(session: string, autoStart: boolean) {
    todo();
  }

  /**
   * Start the worker.
   *
   * @param session session ID for authentication.
   */
  startWorker(session: string) {
    todo();
  }

  /**
   * Step the worker, causing it to complete one job, and then stop.
   *
   * @param session session ID for authentication.
   */
  async stepWorker(session: string) {
    todo();
  }

  /**
   * Stop the worker.
   *
   * @param session session ID for authentication.
   * @param now whether to stop the worker immediately (true), or wait for the current job to
   * finish (false).
   */
  async stopWorker(session: string, now: boolean) {
    todo();
  }

  /**
   * Stop the worker and immediately restart it.
   *
   * @param session session ID for authentication.
   */
  restartWorker(session: string) {
    todo();
  }

  /**
   * Wait for the worker to stop, and then resolve.
   *
   * @param session session ID for authentication.
   */
  workerStopped(session: string): Promise<void> {
    todo();
  }
}
