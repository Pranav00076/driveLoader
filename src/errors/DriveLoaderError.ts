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
      `[DriveLoader: Invalid URL] What happened: "${inputUrl}" is not a recognized Google Drive URL or File ID.\n` +
        `• Why it happened: The input link format does not match file/d/ID/view, open?id=ID, uc?id=ID, or a 25-50 character string.\n` +
        `• How to fix it: Ensure your URL looks like "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view" or pass the raw File ID "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs".\n` +
        `• Docs: https://drive-loader.vercel.app/docs/faq`;
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
      `[DriveLoader: Private File] What happened: Google Drive asset "${fileId}" is private or restricted.\n` +
        `• Why it happened: Google Drive requires public permission to generate public CDN stream/image binaries.\n` +
        `• How to fix it: In Google Drive, click Share -> General access -> Change to "Anyone with the link can view".\n` +
        `• Docs: https://drive-loader.vercel.app/docs/faq`;
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
      `[DriveLoader: Resolution Failed] What happened: Failed to resolve direct CDN URL for Google Drive file ID "${fileId}".\n` +
      `• Why it happened: All ${attemptedEndpoints.length} candidate endpoints failed to respond with a 200 OK media binary.\n` +
      `• How to fix it: Verify that the file exists, has not been deleted, and public sharing is enabled.\n` +
      `• Docs: https://drive-loader.vercel.app/docs/retry-logic`;
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
    super(
      `[DriveLoader: No Candidates] What happened: No CDN candidate URLs generated for ID "${fileId}".\n` +
        `• Why it happened: File ID string is malformed or empty.\n` +
        `• How to fix it: Provide a valid Google Drive File ID string.\n` +
        `• Docs: https://drive-loader.vercel.app/docs/utilities`,
      'NO_CANDIDATES',
      {
        fileId,
      },
    );
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

/**
 * Thrown when an input string is not a valid Google Drive Folder URL or Folder ID.
 */
export class InvalidFolderError extends DriveLoaderError {
  public readonly inputFolder: string;

  constructor(inputFolder: string, message?: string) {
    const formattedMessage =
      message ||
      `[DriveLoader: Invalid Folder] What happened: "${inputFolder}" is not a valid Google Drive Folder link or ID.\n` +
        `• Why it happened: Expected drive.google.com/drive/folders/FOLDER_ID or a 25+ character Folder ID.\n` +
        `• How to fix it: Pass a valid folder link or use useDriveFolder({ folderUrl: "..." }).\n` +
        `• Docs: https://drive-loader.vercel.app/docs/folder-support`;
    super(formattedMessage, 'INVALID_FOLDER', { inputFolder });
    this.name = 'InvalidFolderError';
    this.inputFolder = inputFolder;
  }
}

/**
 * Thrown when an API key is required for Google Drive folder operations but was omitted.
 */
export class ApiKeyMissingError extends DriveLoaderError {
  constructor() {
    super(
      `[DriveLoader: Missing API Key] What happened: Google Drive API Key is required for public folder listings.\n` +
        `• Why it happened: Public Google Drive folder scanning uses Google Drive API v3 REST endpoint.\n` +
        `• How to fix it: Pass apiKey option: useDriveFolder({ folderUrl: "...", apiKey: "YOUR_API_KEY" }).\n` +
        `• Docs: https://drive-loader.vercel.app/docs/folder-support`,
      'API_KEY_MISSING',
    );
    this.name = 'ApiKeyMissingError';
  }
}

/**
 * Thrown when fetching folder files or metadata fails from the Google Drive REST API.
 */
export class FolderLoadError extends DriveLoaderError {
  public readonly folderId: string;
  public readonly statusCode?: number;

  constructor(folderId: string, message: string, statusCode?: number) {
    super(
      `[DriveLoader: Folder Load Error] What happened: Failed to load folder "${folderId}": ${message}.\n` +
        `• Why it happened: Google Drive API returned HTTP ${statusCode || 'error'}.\n` +
        `• How to fix it: Check API Key quotas and verify folder sharing is set to "Anyone with the link can view".\n` +
        `• Docs: https://drive-loader.vercel.app/docs/folder-support`,
      'FOLDER_LOAD_FAILED',
      {
        folderId,
        statusCode,
      },
    );
    this.name = 'FolderLoadError';
    this.folderId = folderId;
    this.statusCode = statusCode;
  }
}

/**
 * Thrown when an input string is not a valid Google Drive video URL or File ID.
 */
export class InvalidVideoError extends DriveLoaderError {
  public readonly inputUrl: string;

  constructor(inputUrl: string, message?: string) {
    const formattedMessage =
      message ||
      `[DriveLoader: Invalid Video] What happened: "${inputUrl}" is not a recognized video share link.\n` +
        `• Why it happened: The input link format could not be parsed into a video file ID.\n` +
        `• How to fix it: Pass a valid drive link like <DriveVideo src="https://drive.google.com/file/d/VIDEO_ID/view" />.\n` +
        `• Docs: https://drive-loader.vercel.app/docs/drive-video`;
    super(formattedMessage, 'INVALID_VIDEO_URL', { inputUrl });
    this.name = 'InvalidVideoError';
    this.inputUrl = inputUrl;
  }
}

/**
 * Thrown when resolving a Google Drive video fails across candidate endpoints.
 */
export class VideoResolutionError extends DriveLoaderError {
  public readonly fileId: string;
  public readonly attemptedEndpoints: string[];

  constructor(fileId: string, attemptedEndpoints: string[], lastError?: Error) {
    const formattedMessage =
      `[DriveLoader: Video Resolution Failed] What happened: Failed to stream Google Drive video ID "${fileId}".\n` +
      `• Why it happened: All ${attemptedEndpoints.length} video stream endpoints failed.\n` +
      `• How to fix it: Verify that the video is public and Google Drive has processed its preview stream.\n` +
      `• Docs: https://drive-loader.vercel.app/docs/drive-video`;
    super(formattedMessage, 'VIDEO_RESOLUTION_FAILED', {
      fileId,
      attemptedEndpoints,
      lastErrorMsg: lastError?.message,
    });
    this.name = 'VideoResolutionError';
    this.fileId = fileId;
    this.attemptedEndpoints = attemptedEndpoints;
  }
}

/**
 * Thrown when a video format or MIME type is not supported by HTML5 video playback.
 */
export class UnsupportedVideoFormatError extends DriveLoaderError {
  public readonly mimeType?: string;
  public readonly url?: string;

  constructor(mimeTypeOrUrl: string, message?: string) {
    const formattedMessage =
      message ||
      `[DriveLoader: Unsupported Video] What happened: Unsupported video format "${mimeTypeOrUrl}".\n` +
        `• Why it happened: Browser HTML5 video tag supports MP4, WebM, OGG, or MOV.\n` +
        `• How to fix it: Convert video to H.264 MP4 format for universal browser support.\n` +
        `• Docs: https://drive-loader.vercel.app/docs/drive-video`;
    super(formattedMessage, 'UNSUPPORTED_VIDEO_FORMAT', { mimeTypeOrUrl });
    this.name = 'UnsupportedVideoFormatError';
    if (mimeTypeOrUrl.includes('/')) {
      this.mimeType = mimeTypeOrUrl;
    } else {
      this.url = mimeTypeOrUrl;
    }
  }
}

/**
 * Thrown when resolving a Google Drive audio file fails across candidate endpoints.
 */
export class AudioResolutionError extends DriveLoaderError {
  public readonly fileId: string;
  public readonly attemptedEndpoints: string[];

  constructor(fileId: string, attemptedEndpoints: string[], lastError?: Error) {
    const formattedMessage =
      `[DriveLoader: Audio Resolution Failed] What happened: Failed to resolve audio for Google Drive ID "${fileId}".\n` +
      `• Why it happened: All ${attemptedEndpoints.length} audio candidate endpoints failed.\n` +
      `• How to fix it: Verify that the audio file is public and properly uploaded to Google Drive.\n` +
      `• Docs: https://drive-loader.vercel.app/docs/drive-audio`;
    super(formattedMessage, 'AUDIO_RESOLUTION_FAILED', {
      fileId,
      attemptedEndpoints,
      lastErrorMsg: lastError?.message,
    });
    this.name = 'AudioResolutionError';
    this.fileId = fileId;
    this.attemptedEndpoints = attemptedEndpoints;
  }
}

/**
 * Thrown when resolving a Google Drive document fails.
 */
export class DocumentResolutionError extends DriveLoaderError {
  public readonly fileId: string;

  constructor(fileId: string, message?: string) {
    const formattedMessage =
      message ||
      `[DriveLoader: Document Resolution Failed] What happened: Failed to resolve document for ID "${fileId}".\n` +
        `• Why it happened: Google Drive document preview embed is unavailable or restricted.\n` +
        `• How to fix it: Check file permissions and ensure "Anyone with the link can view" is enabled.\n` +
        `• Docs: https://drive-loader.vercel.app/docs/drive-document`;
    super(formattedMessage, 'DOCUMENT_RESOLUTION_FAILED', { fileId });
    this.name = 'DocumentResolutionError';
    this.fileId = fileId;
  }
}

/**
 * Thrown when IndexedDB or SessionStorage caching encounters a storage error.
 */
export class CacheStorageError extends DriveLoaderError {
  public readonly engine: string;

  constructor(engine: string, message: string) {
    super(`Cache Storage Error [${engine}]: ${message}`, 'CACHE_STORAGE_ERROR', { engine });
    this.name = 'CacheStorageError';
    this.engine = engine;
  }
}

/**
 * Thrown when an audio format is not supported by HTML5 Audio.
 */
export class UnsupportedAudioFormatError extends DriveLoaderError {
  public readonly format: string;

  constructor(format: string, message?: string) {
    const formattedMessage =
      message ||
      `[DriveLoader: Unsupported Audio] What happened: Unsupported audio format "${format}".\n` +
        `• Why it happened: HTML5 audio requires MP3, WAV, AAC, OGG, FLAC, or M4A.\n` +
        `• How to fix it: Convert audio to standard MP3 or AAC format.\n` +
        `• Docs: https://drive-loader.vercel.app/docs/drive-audio`;
    super(formattedMessage, 'UNSUPPORTED_AUDIO_FORMAT', { format });
    this.name = 'UnsupportedAudioFormatError';
    this.format = format;
  }
}

/**
 * Thrown when a document format is not supported for previewing.
 */
export class UnsupportedDocumentFormatError extends DriveLoaderError {
  public readonly format: string;

  constructor(format: string, message?: string) {
    const formattedMessage =
      message ||
      `[DriveLoader: Unsupported Document] What happened: Unsupported document format "${format}".\n` +
        `• Why it happened: DriveDocument supports PDF, TXT, MD, and Google Docs.\n` +
        `• How to fix it: Ensure the document file is saved as PDF, TXT, or MD.\n` +
        `• Docs: https://drive-loader.vercel.app/docs/drive-document`;
    super(formattedMessage, 'UNSUPPORTED_DOCUMENT_FORMAT', { format });
    this.name = 'UnsupportedDocumentFormatError';
    this.format = format;
  }
}
