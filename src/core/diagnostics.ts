import { extractFileId, detectUrlFormat, detectMediaType } from './parser';
import { generateCandidateUrls } from './candidateGenerator';
import { defaultCache } from '../cache/MemoryCache';
import type { UrlDiagnostics } from '../types/index';

/**
 * Performs comprehensive diagnostic inspection of a Google Drive URL or File ID string.
 * Helpful for debugging broken links, analyzing link formats, and inspecting cache status.
 *
 * @param url - The Google Drive URL or File ID string to analyze.
 * @returns Diagnostic analysis summary object.
 *
 * @example
 * ```ts
 * const info = analyzeDriveUrl('https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j/view');
 * console.log(info.valid, info.fileId, info.recommendations);
 * ```
 */
export function analyzeDriveUrl(url: string): UrlDiagnostics {
  const fileId = extractFileId(url);
  const detectedFormat = detectUrlFormat(url);
  const mediaType = detectMediaType(url);
  const valid = fileId !== null;

  const candidateUrls = valid ? generateCandidateUrls(fileId).map((c) => c.url) : [];
  const cached = valid ? defaultCache.has(fileId) : false;
  const cacheTTL = valid ? defaultCache.getRemainingTTL(fileId) : null;

  const recommendations: string[] = [];
  const warnings: string[] = [];

  if (!valid) {
    warnings.push(
      `Invalid Google Drive link or File ID string: "${url}". Please ensure the link contains a valid file/d/ path, open?id= query parameter, or a 25-50 character ID.`,
    );
  } else {
    recommendations.push(
      `Valid Google Drive link format ("${detectedFormat}") parsed. Media Type: "${mediaType}". File ID extracted: "${fileId}".`,
    );
    recommendations.push(
      `Verify in Google Drive that file access is set to "Anyone with the link can view".`,
    );

    if (cached) {
      recommendations.push(
        `Resolution for file ID "${fileId}" is cached in memory (${Math.round((cacheTTL || 0) / 1000)}s remaining TTL).`,
      );
    } else {
      recommendations.push(
        `Resolution for file ID "${fileId}" is not currently in memory cache and will trigger endpoint probing.`,
      );
    }

    if (detectedFormat === 'raw_id') {
      recommendations.push(
        `Raw File ID supplied. Direct CDN candidate URLs generated automatically.`,
      );
    }
  }

  return {
    valid,
    fileId,
    detectedFormat,
    mediaType,
    candidateUrls,
    cached,
    cacheTTL,
    recommendations,
    warnings,
  };
}

