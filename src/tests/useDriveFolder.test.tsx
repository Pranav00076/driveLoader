import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDriveFolder } from '../hooks/useDriveFolder';
import { defaultCache } from '../cache/MemoryCache';

describe('useDriveFolder Hook', () => {
  const FOLDER_ID = '1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P';
  const FOLDER_URL = `https://drive.google.com/drive/folders/${FOLDER_ID}`;
  const API_KEY = 'TEST_GOOGLE_API_KEY';

  beforeEach(() => {
    defaultCache.clear();
    vi.restoreAllMocks();
  });

  it('should transition from loading to success state and load folder assets', async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes(`/files/${FOLDER_ID}`)) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: FOLDER_ID, name: 'Hook Test Folder' }),
        });
      }

      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            files: [
              { id: 'FILE_1', name: 'img1.jpg', mimeType: 'image/jpeg' },
              { id: 'FILE_2', name: 'img2.png', mimeType: 'image/png' },
            ],
          }),
      });
    });

    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() =>
      useDriveFolder({
        folderUrl: FOLDER_URL,
        apiKey: API_KEY,
        probeFn: async () => true,
      }),
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.folder?.name).toBe('Hook Test Folder');
    expect(result.current.assets.length).toBe(2);
  });
});
