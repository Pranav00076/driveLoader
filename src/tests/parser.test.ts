import { describe, it, expect } from 'vitest';
import { extractFileId, isGoogleDriveUrl, detectUrlFormat } from '../core/parser';

describe('Google Drive URL Parser', () => {
  const VALID_ID = '1A2b3C4d5E6f7G8h9I0j1K2L3M4N5O6P';

  describe('extractFileId()', () => {
    it('should extract file ID from file/d/ format', () => {
      const url = `https://drive.google.com/file/d/${VALID_ID}/view?usp=sharing`;
      expect(extractFileId(url)).toBe(VALID_ID);
    });

    it('should extract file ID from open?id= format', () => {
      const url = `https://drive.google.com/open?id=${VALID_ID}`;
      expect(extractFileId(url)).toBe(VALID_ID);
    });

    it('should extract file ID from uc?id= format', () => {
      const url = `https://drive.google.com/uc?export=view&id=${VALID_ID}`;
      expect(extractFileId(url)).toBe(VALID_ID);
    });

    it('should extract file ID from docs.google.com format', () => {
      const url = `https://docs.google.com/uc?id=${VALID_ID}`;
      expect(extractFileId(url)).toBe(VALID_ID);
    });

    it('should extract file ID from lh3.googleusercontent.com format', () => {
      const url = `https://lh3.googleusercontent.com/d/${VALID_ID}`;
      expect(extractFileId(url)).toBe(VALID_ID);
    });

    it('should extract file ID from drive.usercontent.google.com format', () => {
      const url = `https://drive.usercontent.google.com/download?id=${VALID_ID}&confirm=t`;
      expect(extractFileId(url)).toBe(VALID_ID);
    });

    it('should accept direct raw File ID string', () => {
      expect(extractFileId(VALID_ID)).toBe(VALID_ID);
    });

    it('should return null for invalid URLs or empty strings', () => {
      expect(extractFileId('')).toBeNull();
      expect(extractFileId('https://example.com/image.png')).toBeNull();
      expect(extractFileId('short')).toBeNull();
      expect(extractFileId(null as unknown as string)).toBeNull();
    });
  });

  describe('isGoogleDriveUrl()', () => {
    it('should return true for valid Google Drive URLs', () => {
      expect(isGoogleDriveUrl(`https://drive.google.com/file/d/${VALID_ID}/view`)).toBe(true);
      expect(isGoogleDriveUrl(VALID_ID)).toBe(true);
    });

    it('should return false for non-Drive URLs', () => {
      expect(isGoogleDriveUrl('https://google.com')).toBe(false);
      expect(isGoogleDriveUrl('invalid')).toBe(false);
    });
  });

  describe('detectUrlFormat()', () => {
    it('should correctly classify link formats', () => {
      expect(detectUrlFormat(`https://drive.google.com/file/d/${VALID_ID}/view`)).toBe('file_d');
      expect(detectUrlFormat(`https://drive.google.com/open?id=${VALID_ID}`)).toBe('open_id');
      expect(detectUrlFormat(`https://drive.google.com/uc?id=${VALID_ID}`)).toBe('uc_id');
      expect(detectUrlFormat(`https://docs.google.com/uc?id=${VALID_ID}`)).toBe('docs_uc');
      expect(detectUrlFormat(`https://lh3.googleusercontent.com/d/${VALID_ID}`)).toBe('lh3');
      expect(detectUrlFormat(`https://drive.usercontent.google.com/download?id=${VALID_ID}`)).toBe(
        'usercontent',
      );
      expect(detectUrlFormat(VALID_ID)).toBe('raw_id');
      expect(detectUrlFormat('invalid')).toBe('unknown');
    });
  });
});
