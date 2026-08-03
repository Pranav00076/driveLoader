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
const AUDIO_EXTENSIONS_REGEX = /\.(mp3|wav|aac|ogg|flac|m4a|wma|opus|aiff)(\?.*)?$/i;
const DOCUMENT_EXTENSIONS_REGEX = /\.(pdf|txt|md|doc|docx|xls|xlsx|ppt|pptx|rtf|csv|json)(\?.*)?$/i;
const IMAGE_EXTENSIONS_REGEX = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|tiff|heic|avif)(\?.*)?$/i;

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

/**
 * Checks whether a given string or URL represents a Google Drive audio asset.
 *
 * @param urlOrId - The input Google Drive link, raw file ID, or media URL string.
 * @returns `true` if identified as an audio asset, `false` otherwise.
 */
export function isDriveAudio(urlOrId: string): boolean {
  if (!urlOrId || typeof urlOrId !== 'string') {
    return false;
  }

  const cleaned = urlOrId.trim();
  if (!cleaned) {
    return false;
  }

  if (AUDIO_EXTENSIONS_REGEX.test(cleaned)) {
    return true;
  }

  if (cleaned.toLowerCase().includes('audio/') || /type=audio/i.test(cleaned)) {
    return true;
  }

  if (/\baudio\b/i.test(cleaned)) {
    return true;
  }

  return false;
}

/**
 * Checks whether a given string or URL represents a document (PDF, TXT, MD, Docs).
 *
 * @param urlOrId - The input Google Drive link or file ID string.
 * @returns `true` if identified as a document asset, `false` otherwise.
 */
export function isDriveDocument(urlOrId: string): boolean {
  if (!urlOrId || typeof urlOrId !== 'string') {
    return false;
  }

  const cleaned = urlOrId.trim();
  if (!cleaned) {
    return false;
  }

  if (DOCUMENT_EXTENSIONS_REGEX.test(cleaned)) {
    return true;
  }

  if (
    cleaned.includes('docs.google.com/document') ||
    cleaned.includes('docs.google.com/spreadsheets') ||
    cleaned.includes('docs.google.com/presentation') ||
    /type=(document|pdf|doc|text)/i.test(cleaned) ||
    /format=(pdf|doc|text)/i.test(cleaned) ||
    /mediaType=(document|pdf)/i.test(cleaned) ||
    /(\?|&)(pdf|doc|document)=/i.test(cleaned) ||
    /\b(pdf|document|gdoc)\b/i.test(cleaned) ||
    cleaned.toLowerCase().includes('application/pdf') ||
    cleaned.toLowerCase().includes('text/')
  ) {
    return true;
  }

  return false;
}


/**
 * Automatically classifies an asset URL or MIME type into a MediaType category.
 *
 * @param urlOrId - The input Google Drive link or raw string.
 * @param mimeType - Optional known MIME type.
 * @returns Classified MediaType ('image' | 'video' | 'audio' | 'document' | 'unknown').
 */
export function detectMediaType(
  urlOrId: string,
  mimeType?: string,
): 'image' | 'video' | 'audio' | 'document' | 'unknown' {
  if (mimeType) {
    const lowerMime = mimeType.toLowerCase();
    if (lowerMime.startsWith('image/')) return 'image';
    if (lowerMime.startsWith('video/')) return 'video';
    if (lowerMime.startsWith('audio/')) return 'audio';
    if (
      lowerMime.startsWith('text/') ||
      lowerMime.includes('pdf') ||
      lowerMime.includes('document') ||
      lowerMime.includes('sheet') ||
      lowerMime.includes('presentation')
    ) {
      return 'document';
    }
  }

  if (isDriveVideo(urlOrId)) return 'video';
  if (isDriveAudio(urlOrId)) return 'audio';
  if (isDriveDocument(urlOrId)) return 'document';

  const cleaned = (urlOrId || '').trim();
  if (
    IMAGE_EXTENSIONS_REGEX.test(cleaned) ||
    /\bimage\b/i.test(cleaned) ||
    isGoogleDriveUrl(cleaned)
  ) {
    return 'image';
  }

  return 'unknown';
}
