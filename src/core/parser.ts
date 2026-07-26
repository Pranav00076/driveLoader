import { DRIVE_URL_PATTERNS, RAW_FILE_ID_REGEX } from '../constants/urls';
import type { DriveUrlFormat } from '../types/index';

/**
 * Extracts a Google Drive file ID from any valid Google Drive link format or raw ID string.
 *
 * Supported Formats:
 * - `https://drive.google.com/file/d/FILE_ID/view`
 * - `https://drive.google.com/open?id=FILE_ID`
 * - `https://drive.google.com/uc?id=FILE_ID`
 * - `https://docs.google.com/uc?id=FILE_ID`
 * - `https://lh3.googleusercontent.com/d/FILE_ID`
 * - `https://drive.usercontent.google.com/download?id=FILE_ID`
 * - Direct 25-50 character base64url File ID
 *
 * @param urlOrId - The input Google Drive URL or raw file ID string.
 * @returns The extracted 25-50 character file ID string, or `null` if invalid.
 *
 * @example
 * ```ts
 * extractFileId('https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j/view');
 * // => '1A2b3C4d5E6f7G8h9I0j'
 * ```
 */
export function extractFileId(urlOrId: string): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') {
    return null;
  }

  const cleaned = urlOrId.trim();
  if (!cleaned) {
    return null;
  }

  // 1. Test standard URL patterns
  for (const { regex } of DRIVE_URL_PATTERNS) {
    const match = regex.exec(cleaned);
    if (match?.[1]) {
      return match[1];
    }
  }

  // 2. Generic query parameter fallback matching ?id=... or &id=...
  const queryMatch = /[?&]id=([a-zA-Z0-9_-]{25,50})/i.exec(cleaned);
  if (queryMatch?.[1]) {
    return queryMatch[1];
  }

  // 3. Test raw File ID format
  if (RAW_FILE_ID_REGEX.test(cleaned)) {
    return cleaned;
  }

  return null;
}

/**
 * Checks whether a given string is a valid Google Drive URL or raw File ID.
 *
 * @param urlOrId - The input URL or string to test.
 * @returns `true` if valid, `false` otherwise.
 *
 * @example
 * ```ts
 * isGoogleDriveUrl('https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j/view');
 * // => true
 * ```
 */
export function isGoogleDriveUrl(urlOrId: string): boolean {
  return extractFileId(urlOrId) !== null;
}

/**
 * Detects the specific Google Drive link format variant for diagnostic analysis.
 *
 * @param urlOrId - The input Google Drive URL or string.
 * @returns The detected `DriveUrlFormat` variant name.
 *
 * @example
 * ```ts
 * detectUrlFormat('https://drive.google.com/open?id=1A2b3C4d5E6f7G8h9I0j');
 * // => 'open_id'
 * ```
 */
export function detectUrlFormat(urlOrId: string): DriveUrlFormat {
  if (!urlOrId || typeof urlOrId !== 'string') {
    return 'unknown';
  }

  const cleaned = urlOrId.trim();

  for (const { format, regex } of DRIVE_URL_PATTERNS) {
    if (regex.test(cleaned)) {
      return format;
    }
  }

  if (RAW_FILE_ID_REGEX.test(cleaned)) {
    return 'raw_id';
  }

  if (/[?&]id=[a-zA-Z0-9_-]{25,50}/i.test(cleaned)) {
    return 'uc_id';
  }

  return 'unknown';
}

const VIDEO_EXTENSIONS_REGEX = /\.(mp4|webm|ogg|mov|mkv|m4v|avi|3gp|flv)(\?.*)?$/i;

/**
 * Checks whether a given string or URL represents a Google Drive video asset.
 *
 * @param urlOrId - The input Google Drive link, raw file ID, or media URL string.
 * @returns `true` if identified as a video asset, `false` otherwise.
 *
 * @example
 * ```ts
 * isDriveVideo('https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j/view?type=video');
 * // => true
 * ```
 */
export function isDriveVideo(urlOrId: string): boolean {
  if (!urlOrId || typeof urlOrId !== 'string') {
    return false;
  }

  const cleaned = urlOrId.trim();
  if (!cleaned) {
    return false;
  }

  // Explicit video extension check
  if (VIDEO_EXTENSIONS_REGEX.test(cleaned)) {
    return true;
  }

  // Check video MIME type string or query parameter
  if (cleaned.toLowerCase().includes('video/') || /type=video/i.test(cleaned)) {
    return true;
  }

  const fileId = extractFileId(cleaned);
  if (!fileId) {
    return false;
  }

  // If input string contains video keywords or parameters
  if (/\bvideo\b/i.test(cleaned)) {
    return true;
  }

  return false;
}
