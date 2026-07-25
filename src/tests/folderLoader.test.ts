import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadFolderAssets } from '../core/folderLoader.js';
import { ApiKeyMissingError, InvalidFolderError } from '../errors/DriveLoaderError.js';
import { defaultCache } from '../cache/MemoryCache.js';

describe('Folder Loader (loadFolderAssets)', () => {
  const FOLDER_ID = '1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P';
  const FOLDER_URL = `https://drive.google.com/drive/folders/${FOLDER_ID}`;
  const API_KEY = 'TEST_GOOGLE_API_KEY';

  beforeEach(() => {
    defaultCache.clear();
    vi.restoreAllMocks();
  });

  it('should throw InvalidFolderError if folderId and folderUrl are omitted or invalid', async () => {
    await expect(loadFolderAssets({ apiKey: API_KEY })).rejects.toThrow(InvalidFolderError);
    await expect(loadFolderAssets({ folderUrl: 'invalid', apiKey: API_KEY })).rejects.toThrow(
      InvalidFolderError,
    );
  });

  it('should throw ApiKeyMissingError if apiKey is omitted or empty', async () => {
    await expect(loadFolderAssets({ folderUrl: FOLDER_URL, apiKey: '' })).rejects.toThrow(
      ApiKeyMissingError,
    );
  });

  it('should fetch folder metadata and filter media assets', async () => {
    // Mock global fetch for files.get and files.list
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes(`/files/${FOLDER_ID}`)) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              id: FOLDER_ID,
              name: 'Sample Vacation Photos',
              webViewLink: `https://drive.google.com/drive/folders/${FOLDER_ID}`,
              createdTime: '2026-01-01T00:00:00Z',
            }),
        });
      }

      if (url.includes('/files?q=')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              files: [
                {
                  id: 'FILE_ID_1',
                  name: 'beach.jpg',
                  mimeType: 'image/jpeg',
                  size: '1024500',
                  createdTime: '2026-01-02T00:00:00Z',
                },
                {
                  id: 'FILE_ID_2',
                  name: 'sunset.mp4',
                  mimeType: 'video/mp4',
                  size: '20485000',
                  createdTime: '2026-01-03T00:00:00Z',
                },
                {
                  id: 'FILE_ID_3',
                  name: 'notes.pdf',
                  mimeType: 'application/pdf',
                },
              ],
              nextPageToken: 'TOKEN_123',
            }),
        });
      }

      return Promise.reject(new Error('Unknown URL'));
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await loadFolderAssets({
      folderUrl: FOLDER_URL,
      apiKey: API_KEY,
      probeFn: async () => true,
    });

    expect(result.folder?.name).toBe('Sample Vacation Photos');
    expect(result.assets.length).toBe(2); // PDF ignored
    expect(result.assets[0]?.name).toBe('beach.jpg');
    expect(result.assets[0]?.type).toBe('image');
    expect(result.assets[0]?.extension).toBe('jpg');
    expect(result.assets[1]?.name).toBe('sunset.mp4');
    expect(result.assets[1]?.type).toBe('video');
    expect(result.assets[1]?.extension).toBe('mp4');
    expect(result.hasMore).toBe(true);
    expect(result.nextPageToken).toBe('TOKEN_123');
  });

  it('should support extension filtering', async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes(`/files/${FOLDER_ID}`)) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: FOLDER_ID, name: 'Folder' }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            files: [
              { id: '1', name: 'photo1.jpg', mimeType: 'image/jpeg' },
              { id: '2', name: 'photo2.png', mimeType: 'image/png' },
            ],
          }),
      });
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await loadFolderAssets({
      folderId: FOLDER_ID,
      apiKey: API_KEY,
      extensions: ['png'],
      probeFn: async () => true,
    });

    expect(result.assets.length).toBe(1);
    expect(result.assets[0]?.name).toBe('photo2.png');
  });
});
