/**
 * Base custom error class for all @driveloader/react errors.
 */
export class DriveLoaderError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, code = 'DRIVE_LOADER_ERROR', details?: Record<string, unknown>) {
    super(message);
    this.name = 'DriveLoaderError';
    this.code = code;
    this.details = details;

    // Restore prototype chain for ES5 / TypeScript extending Error
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when an input string is not a valid Google Drive URL or File ID.
 */
export class InvalidDriveUrlError extends DriveLoaderError {
  public readonly inputUrl: string;

  constructor(inputUrl: string, message?: string) {
    const formattedMessage =
      message ||
      `Invalid Google Drive URL or File ID format: "${inputUrl}". Expected a valid Google Drive link or 28+ character file ID.`;
    super(formattedMessage, 'INVALID_DRIVE_URL', { inputUrl });
    this.name = 'InvalidDriveUrlError';
    this.inputUrl = inputUrl;
  }
}

/**
 * Thrown when access to a Google Drive file is restricted or private.
 */
export class PrivateFileError extends DriveLoaderError {
  public readonly fileId: string;

  constructor(fileId: string, message?: string) {
    const formattedMessage =
      message ||
      `Google Drive image with ID "${fileId}" appears to be private or unaccessible. Please enable "Anyone with the link can view" access in Google Drive sharing settings.`;
    super(formattedMessage, 'PRIVATE_FILE_ERROR', { fileId });
    this.name = 'PrivateFileError';
    this.fileId = fileId;
  }
}

/**
 * Thrown when all generated candidate endpoints fail to resolve/load the image.
 */
export class ResolutionFailedError extends DriveLoaderError {
  public readonly fileId: string;
  public readonly attemptedEndpoints: string[];

  constructor(fileId: string, attemptedEndpoints: string[], lastError?: Error) {
    const formattedMessage =
      `Failed to resolve image for Google Drive file ID "${fileId}". All ${attemptedEndpoints.length} candidate endpoints failed to return a valid image.` +
      ` Ensure the file is a valid image and public sharing is enabled.`;
    super(formattedMessage, 'RESOLUTION_FAILED', {
      fileId,
      attemptedEndpoints,
      lastErrorMsg: lastError?.message,
    });
    this.name = 'ResolutionFailedError';
    this.fileId = fileId;
    this.attemptedEndpoints = attemptedEndpoints;
  }
}

/**
 * Thrown when candidate URL generation yields no valid candidates.
 */
export class NoCandidateUrlsError extends DriveLoaderError {
  public readonly fileId: string;

  constructor(fileId: string) {
    super(`No candidate URLs could be generated for Google Drive ID "${fileId}".`, 'NO_CANDIDATES', {
      fileId,
    });
    this.name = 'NoCandidateUrlsError';
    this.fileId = fileId;
  }
}

/**
 * Thrown when a cache operation encounters an issue or misconfiguration.
 */
export class CacheError extends DriveLoaderError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(`DriveLoader Cache Error: ${message}`, 'CACHE_ERROR', details);
    this.name = 'CacheError';
  }
}
