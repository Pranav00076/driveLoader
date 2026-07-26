import { RAW_FILE_ID_REGEX } from '../constants/urls';

const FOLDER_URL_PATTERNS: RegExp[] = [
  /drive\.google\.com\/(?:drive\/)?(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]{25,50})/i,
  /drive\.google\.com\/.*[?&]id=([a-zA-Z0-9_-]{25,50})/i,
  /drive\.google\.com\/.*[?&]folderId=([a-zA-Z0-9_-]{25,50})/i,
];

/**
 * Extracts a Google Drive Folder ID from any valid Google Drive folder URL or raw ID string.
 *
 * Supported Formats:
 * - `https://drive.google.com/drive/folders/FOLDER_ID`
 * - `https://drive.google.com/drive/u/0/folders/FOLDER_ID`
 * - `https://drive.google.com/open?id=FOLDER_ID`
 * - Direct 25-50 character base64url Folder ID
 *
 * @param urlOrId - The input Google Drive folder URL or raw folder ID string.
 * @returns The extracted 25-50 character folder ID string, or `null` if invalid.
 *
 * @example
 * ```ts
 * extractFolderId('https://drive.google.com/drive/folders/1a2B3c4D5e6F7g8H9i0J');
 * // => '1a2B3c4D5e6F7g8H9i0J'
 * ```
 */
export function extractFolderId(urlOrId: string): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') {
    return null;
  }

  const cleaned = urlOrId.trim();
  if (!cleaned) {
    return null;
  }

  // 1. Test standard folder URL regex patterns
  for (const regex of FOLDER_URL_PATTERNS) {
    const match = regex.exec(cleaned);
    if (match?.[1]) {
      return match[1];
    }
  }

  // 2. Test raw Folder ID format
  if (RAW_FILE_ID_REGEX.test(cleaned)) {
    return cleaned;
  }

  return null;
}

/**
 * Checks whether a given string is a valid Google Drive folder URL or raw Folder ID.
 *
 * @param urlOrId - The input string to test.
 * @returns `true` if valid, `false` otherwise.
 *
 * @example
 * ```ts
 * isGoogleDriveFolder('https://drive.google.com/drive/folders/1a2B3c4D5e6F7g8H9i0J');
 * // => true
 * ```
 */
export function isGoogleDriveFolder(urlOrId: string): boolean {
  return extractFolderId(urlOrId) !== null;
}
