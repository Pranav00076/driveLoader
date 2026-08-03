import { describe, it, expect, beforeEach } from 'vitest';
import {
  isDriveVideo,
  resolveDriveVideo,
  extractVideoMetadata,
  getVideoThumbnail,
  prefetchVideo,
  InvalidVideoError,
} from '../index';
import { defaultCache } from '../cache/MemoryCache';

describe('Video Resolution & Utility Engine', () => {
  const VALID_ID = '1A2b3C4d5E6f7G8h9I0j1K2L3M4N5O6P';
  const VALID_URL = `https://drive.google.com/file/d/${VALID_ID}/view`;

  beforeEach(() => {
    defaultCache.clear();
  });

  describe('isDriveVideo', () => {
    it('should correctly identify video URLs and extensions', () => {
      expect(isDriveVideo('https://example.com/video.mp4')).toBe(true);
      expect(isDriveVideo('https://example.com/clip.webm')).toBe(true);
      expect(isDriveVideo('https://example.com/movie.mov')).toBe(true);
      expect(isDriveVideo(`https://drive.google.com/file/d/${VALID_ID}/view?type=video`)).toBe(
        true,
      );
      expect(
        isDriveVideo(`https://drive.google.com/file/d/${VALID_ID}/view?mimeType=video/mp4`),
      ).toBe(true);
    });

    it('should return false for non-video URLs', () => {
      expect(isDriveVideo('https://example.com/image.jpg')).toBe(false);
      expect(isDriveVideo(VALID_URL)).toBe(false);
      expect(isDriveVideo('')).toBe(false);
    });
  });

  describe('getVideoThumbnail', () => {
    it('should generate Google Drive video thumbnail URL for valid file IDs', () => {
      const thumb = getVideoThumbnail(VALID_URL);
      expect(thumb).toBe(`https://drive.google.com/thumbnail?id=${VALID_ID}&sz=w1000`);
    });

    it('should support custom width parameter', () => {
      const thumb = getVideoThumbnail(VALID_ID, { width: 500 });
      expect(thumb).toBe(`https://drive.google.com/thumbnail?id=${VALID_ID}&sz=w500`);
    });
  });

  describe('extractVideoMetadata', () => {
    it('should extract video metadata structure with default fallback', async () => {
      const metadata = await extractVideoMetadata(VALID_URL);

      expect(metadata).toBeDefined();
      expect(metadata.width).toBeGreaterThan(0);
      expect(metadata.height).toBeGreaterThan(0);
      expect(metadata.mimeType).toBe('video/mp4');
      expect(metadata.thumbnailUrl).toBe(
        `https://drive.google.com/thumbnail?id=${VALID_ID}&sz=w1000`,
      );
    });
  });

  describe('resolveDriveVideo', () => {
    it('should resolve Google Drive video share link to direct CDN URL', async () => {
      const result = await resolveDriveVideo(VALID_URL, {
        timeout: 100,
        probeFn: async () => true,
      });

      expect(result).toBeDefined();
      expect(result.videoUrl).toBe(
        `https://drive.usercontent.google.com/download?id=${VALID_ID}&confirm=t`,
      );
      expect(result.fileId).toBe(VALID_ID);
      expect(result.metadata).toBeDefined();
      expect(result.thumbnailUrl).toBeDefined();
    });

    it('should throw InvalidVideoError for invalid input strings', async () => {
      await expect(resolveDriveVideo('invalid-short-string')).rejects.toThrow(InvalidVideoError);
    });
  });

  describe('prefetchVideo', () => {
    it('should prefetch video resolution into memory cache', async () => {
      const result = await prefetchVideo(VALID_URL, { timeout: 100, probeFn: async () => true });

      expect(result.videoUrl).toBeDefined();
      expect(defaultCache.has(VALID_ID)).toBe(true);
    });
  });
});
