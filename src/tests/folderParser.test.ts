import { describe, it, expect } from 'vitest';
import { extractFolderId, isGoogleDriveFolder } from '../core/folderParser';

describe('Google Drive Folder Parser', () => {
  const VALID_FOLDER_ID = '1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P';

  describe('extractFolderId()', () => {
    it('should extract folder ID from drive/folders/ format', () => {
      const url = `https://drive.google.com/drive/folders/${VALID_FOLDER_ID}?usp=sharing`;
      expect(extractFolderId(url)).toBe(VALID_FOLDER_ID);
    });

    it('should extract folder ID from drive/u/0/folders/ format', () => {
      const url = `https://drive.google.com/drive/u/0/folders/${VALID_FOLDER_ID}`;
      expect(extractFolderId(url)).toBe(VALID_FOLDER_ID);
    });

    it('should extract folder ID from open?id= format', () => {
      const url = `https://drive.google.com/open?id=${VALID_FOLDER_ID}`;
      expect(extractFolderId(url)).toBe(VALID_FOLDER_ID);
    });

    it('should accept direct raw Folder ID string', () => {
      expect(extractFolderId(VALID_FOLDER_ID)).toBe(VALID_FOLDER_ID);
    });

    it('should return null for invalid folder URLs or empty strings', () => {
      expect(extractFolderId('')).toBeNull();
      expect(extractFolderId('https://example.com/folder')).toBeNull();
      expect(extractFolderId(null as unknown as string)).toBeNull();
    });
  });

  describe('isGoogleDriveFolder()', () => {
    it('should return true for valid Google Drive folder URLs', () => {
      expect(isGoogleDriveFolder(`https://drive.google.com/drive/folders/${VALID_FOLDER_ID}`)).toBe(
        true,
      );
      expect(isGoogleDriveFolder(VALID_FOLDER_ID)).toBe(true);
    });

    it('should return false for invalid folder strings', () => {
      expect(isGoogleDriveFolder('invalid')).toBe(false);
    });
  });
});
