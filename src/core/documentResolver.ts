import { extractFileId } from './parser';
import { InvalidDriveUrlError } from '../errors/DriveLoaderError';
import type { ResolveDocumentResult, ResolveOptions } from '../types/index';

/**
 * Resolves a Google Drive document URL into an embed view link or raw text content.
 *
 * @param urlOrId - The input Google Drive document URL or File ID.
 * @param _options - Resolution options.
 * @returns ResolveDocumentResult containing document preview URL and format classification.
 */
export async function resolveDriveDocument(
  urlOrId: string,
  _options: ResolveOptions = {},
): Promise<ResolveDocumentResult> {
  const fileId = extractFileId(urlOrId);
  if (!fileId) {
    throw new InvalidDriveUrlError(urlOrId);
  }

  const lower = urlOrId.toLowerCase();
  let format: 'pdf' | 'txt' | 'md' | 'gdoc' = 'pdf';

  if (lower.includes('.txt') || lower.includes('text/plain')) {
    format = 'txt';
  } else if (lower.includes('.md') || lower.includes('markdown')) {
    format = 'md';
  } else if (lower.includes('docs.google.com/document')) {
    format = 'gdoc';
  }

  const documentUrl = `https://drive.google.com/file/d/${fileId}/preview`;

  let content: string | undefined = undefined;

  // If text or markdown file, fetch content if possible
  if (format === 'txt' || format === 'md') {
    try {
      const rawUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      const res = await fetch(rawUrl);
      if (res.ok) {
        content = await res.text();
      }
    } catch {
      // Content fetch fallback
    }
  }

  return {
    documentUrl,
    fileId,
    format,
    content,
    fromCache: false,
  };
}
