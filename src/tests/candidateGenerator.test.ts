import { describe, it, expect } from 'vitest';
import { generateCandidateUrls } from '../core/candidateGenerator.js';

describe('Candidate URL Generator', () => {
  const FILE_ID = '1A2b3C4d5E6f7G8h9I0j1K2L3M4N5O6P';

  it('should generate multiple candidate endpoint URLs', () => {
    const candidates = generateCandidateUrls(FILE_ID);
    expect(candidates.length).toBeGreaterThanOrEqual(4);
    expect(candidates[0]?.url).toContain(FILE_ID);
  });

  it('should custom width options in thumbnail endpoints', () => {
    const candidates = generateCandidateUrls(FILE_ID, { width: 800 });
    const thumb = candidates.find((c) => c.id === 'drive_thumbnail');
    expect(thumb?.url).toContain('sz=w800');
  });

  it('should prioritize learned endpoint index if provided', () => {
    // Force index 2 (drive_thumbnail) to be prioritized
    const candidates = generateCandidateUrls(FILE_ID, { learnedEndpointIndex: 2 });
    expect(candidates[0]?.index).toBe(2);
    expect(candidates[0]?.id).toBe('drive_thumbnail');
  });
});
