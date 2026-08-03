import { extractFileId } from './parser';
import { generateCandidateUrls } from './candidateGenerator';
import { resolveDriveImage } from './resolver';
import { defaultCache } from '../cache/MemoryCache';
import { InvalidDriveUrlError } from '../errors/DriveLoaderError';
import type { DriveAudioMetadata, ResolveAudioResult, ResolveOptions } from '../types/index';

/**
 * Resolves a Google Drive audio URL into a streamable direct audio URL.
 *
 * @param urlOrId - The input Google Drive audio link or File ID.
 * @param options - Optional resolution parameters.
 * @returns ResolveAudioResult containing the audio stream URL and track metadata.
 */
export async function resolveDriveAudio(
  urlOrId: string,
  options: ResolveOptions = {},
): Promise<ResolveAudioResult> {
  const fileId = extractFileId(urlOrId);
  if (!fileId) {
    throw new InvalidDriveUrlError(urlOrId);
  }

  const cached = defaultCache.get(fileId);
  if (cached && options.cache !== false) {
    const streamUrl =
      cached.imageUrl ||
      cached.videoUrl ||
      `https://drive.google.com/uc?export=download&id=${fileId}`;
    return {
      audioUrl: streamUrl,
      fileId,
      attemptedEndpoints: cached.attemptedEndpoints || [],
      successfulEndpoint: cached.successfulEndpoint || streamUrl,
      fromCache: true,
      metadata: {
        title: `Drive Audio Track ${fileId.slice(0, 6)}`,
        duration: 0,
        mimeType: 'audio/mpeg',
      },
    };
  }

  // Use candidate generator to obtain streaming candidates
  const candidates = generateCandidateUrls(fileId);

  // Try resolving through standard resolver candidate probe or fallback to direct download URL
  try {
    const imageRes = await resolveDriveImage(urlOrId, { ...options, cache: options.cache ?? true });
    const audioUrl = imageRes.imageUrl;

    const metadata: DriveAudioMetadata = {
      title: `Track ${fileId.slice(0, 8)}`,
      duration: 0,
      mimeType: 'audio/mpeg',
    };

    return {
      audioUrl,
      fileId,
      attemptedEndpoints: imageRes.attemptedEndpoints,
      successfulEndpoint: imageRes.successfulEndpoint,
      fromCache: false,
      metadata,
    };
  } catch {
    // Direct audio download fallback candidate endpoint
    const fallbackUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    return {
      audioUrl: fallbackUrl,
      fileId,
      attemptedEndpoints: candidates.map((c) => c.url),
      successfulEndpoint: fallbackUrl,

      fromCache: false,
      metadata: {
        title: `Track ${fileId.slice(0, 8)}`,
        duration: 0,
        mimeType: 'audio/mpeg',
      },
    };
  }
}
