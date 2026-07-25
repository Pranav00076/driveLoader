import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDriveVideo } from '../index.js';
import { defaultCache } from '../cache/MemoryCache.js';

describe('useDriveVideo Hook', () => {
  const VALID_ID = '1A2b3C4d5E6f7G8h9I0j1K2L3M4N5O6P';
  const VALID_URL = `https://drive.google.com/file/d/${VALID_ID}/view`;

  beforeEach(() => {
    defaultCache.clear();
  });

  it('should resolve video URL and metadata for valid Google Drive file ID', async () => {
    const { result } = renderHook(() => useDriveVideo(VALID_URL, { timeout: 100 }));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.videoUrl).toBe(`https://lh3.googleusercontent.com/d/${VALID_ID}`);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.metadata).toBeDefined();
      expect(result.current.thumbnailUrl).toContain(`thumbnail?id=${VALID_ID}`);
    });
  });

  it('should return error state for invalid input string', async () => {
    const { result } = renderHook(() => useDriveVideo('invalid-string'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).not.toBeNull();
      expect(result.current.isError).toBe(true);
      expect(result.current.videoUrl).toBeNull();
    });
  });
});
