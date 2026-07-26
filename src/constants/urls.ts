import type { DriveUrlFormat } from '../types/index';

/**
 * Default global configuration values.
 */
export const DEFAULT_CONFIG = {
  cacheTTL: 3600000, // 1 hour in ms
  maxCacheSize: 500, // max 500 items in memory
  timeout: 8000, // 8 seconds per candidate probe
  retries: 2,
  width: 1000,
  debug: false,
  lazy: true,
  concurrency: 4,
} as const;

/**
 * Candidate endpoint generator templates.
 */
export const CANDIDATE_ENDPOINT_TEMPLATES = [
  {
    id: 'lh3_direct',
    template: (fileId: string) => `https://lh3.googleusercontent.com/d/${fileId}`,
  },
  {
    id: 'drive_uc_export',
    template: (fileId: string) => `https://drive.google.com/uc?export=view&id=${fileId}`,
  },
  {
    id: 'drive_thumbnail',
    template: (fileId: string, width = 1000) =>
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`,
  },
  {
    id: 'docs_uc_export',
    template: (fileId: string) => `https://docs.google.com/uc?export=view&id=${fileId}`,
  },
  {
    id: 'drive_usercontent_download',
    template: (fileId: string) =>
      `https://drive.usercontent.google.com/download?id=${fileId}&confirm=t`,
  },
] as const;

/**
 * Regex patterns for extracting Google Drive file IDs and classifying link formats.
 */
export const DRIVE_URL_PATTERNS: Array<{
  format: DriveUrlFormat;
  regex: RegExp;
}> = [
  // drive.google.com/file/d/{ID}/view...
  {
    format: 'file_d',
    regex: /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{25,50})/i,
  },
  // drive.google.com/open?id={ID}
  {
    format: 'open_id',
    regex: /drive\.google\.com\/open\?.*id=([a-zA-Z0-9_-]{25,50})/i,
  },
  // drive.google.com/uc?id={ID} or export=view&id={ID}
  {
    format: 'uc_id',
    regex: /drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]{25,50})/i,
  },
  // docs.google.com/uc?id={ID} or docs.google.com/file/d/{ID}
  {
    format: 'docs_uc',
    regex: /docs\.google\.com\/(?:uc\?.*id=|file\/d\/)([a-zA-Z0-9_-]{25,50})/i,
  },
  // lh3.googleusercontent.com/d/{ID}
  {
    format: 'lh3',
    regex: /lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]{25,50})/i,
  },
  // drive.usercontent.google.com/download?id={ID}
  {
    format: 'usercontent',
    regex: /drive\.usercontent\.google\.com\/download\?.*id=([a-zA-Z0-9_-]{25,50})/i,
  },
];

/**
 * Raw Google Drive File ID regex matcher (25 to 50 base64url characters).
 */
export const RAW_FILE_ID_REGEX = /^[a-zA-Z0-9_-]{25,50}$/;
