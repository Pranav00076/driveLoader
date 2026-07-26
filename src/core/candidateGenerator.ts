import { CANDIDATE_ENDPOINT_TEMPLATES } from '../constants/urls';
import { defaultCache } from '../cache/MemoryCache';

export interface CandidateEndpoint {
  url: string;
  index: number;
  id: string;
}

/**
 * Generates an ordered list of Google Drive CDN candidate direct URLs for a file ID.
 * Automatically incorporates Endpoint Learning by prioritizing previously successful endpoints.
 *
 * @param fileId - The Google Drive 25-50 character File ID.
 * @param options - Options including target thumbnail width and preferred learned endpoint index.
 * @returns Array of candidate endpoint objects containing candidate URL, index, and ID.
 *
 * @example
 * ```ts
 * const candidates = generateCandidateUrls('1A2b3C4d5E6f7G8h9I0j');
 * console.log(candidates[0].url);
 * // => 'https://lh3.googleusercontent.com/d/1A2b3C4d5E6f7G8h9I0j'
 * ```
 */
export function generateCandidateUrls(
  fileId: string,
  options?: { width?: number; learnedEndpointIndex?: number | null },
): CandidateEndpoint[] {
  if (!fileId) return [];

  const width = options?.width || 1000;
  const candidates: CandidateEndpoint[] = CANDIDATE_ENDPOINT_TEMPLATES.map((item, index) => ({
    url: item.template(fileId, width),
    index,
    id: item.id,
  }));

  // Determine preferred learned endpoint index
  const preferredIndex =
    options?.learnedEndpointIndex !== undefined
      ? options.learnedEndpointIndex
      : defaultCache.getPreferredEndpointIndex();

  if (preferredIndex !== null && preferredIndex >= 0 && preferredIndex < candidates.length) {
    const targetCandidate = candidates.find((c) => c.index === preferredIndex);
    if (targetCandidate) {
      // Reorder candidates so preferred candidate is tested FIRST
      const filtered = candidates.filter((c) => c.index !== preferredIndex);
      return [targetCandidate, ...filtered];
    }
  }

  return candidates;
}
