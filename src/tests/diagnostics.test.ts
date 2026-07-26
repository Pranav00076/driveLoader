import { describe, it, expect } from 'vitest';
import { analyzeDriveUrl } from '../core/diagnostics';

describe('Diagnostics API (analyzeDriveUrl)', () => {
  const VALID_ID = '1A2b3C4d5E6f7G8h9I0j1K2L3M4N5O6P';

  it('should return detailed diagnostic analysis for valid Drive URLs', () => {
    const diag = analyzeDriveUrl(`https://drive.google.com/file/d/${VALID_ID}/view`);
    expect(diag.valid).toBe(true);
    expect(diag.fileId).toBe(VALID_ID);
    expect(diag.detectedFormat).toBe('file_d');
    expect(diag.candidateUrls.length).toBeGreaterThan(0);
    expect(diag.recommendations.length).toBeGreaterThan(0);
  });

  it('should return diagnostic warnings for invalid strings', () => {
    const diag = analyzeDriveUrl('invalid-link');
    expect(diag.valid).toBe(false);
    expect(diag.fileId).toBeNull();
    expect(diag.warnings.length).toBeGreaterThan(0);
  });
});
