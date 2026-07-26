import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDriveImage } from '../hooks/useDriveImage';
import { DriveLoaderProvider } from '../context/DriveLoaderContext';
import { defaultCache } from '../cache/MemoryCache';

describe('useDriveImage Hook', () => {
  const VALID_ID = '1A2b3C4d5E6f7G8h9I0j1K2L3M4N5O6P';
  const VALID_URL = `https://drive.google.com/file/d/${VALID_ID}/view`;

  beforeEach(() => {
    defaultCache.clear();
  });

  it('should transition from loading to success state for valid Drive URLs', async () => {
    const { result } = renderHook(() =>
      useDriveImage(VALID_URL, { timeout: 100, probeFn: async () => true }),
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.imageUrl).not.toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should transition to error state for invalid Drive URLs', async () => {
    const { result } = renderHook(() => useDriveImage('invalid-link'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.isError).toBe(true);
    expect(result.current.error).not.toBeNull();
    expect(result.current.imageUrl).toBeNull();
  });

  it('should inherit options from DriveLoaderProvider', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DriveLoaderProvider cacheTTL={5000} debug={false}>
        {children}
      </DriveLoaderProvider>
    );

    const { result } = renderHook(
      () => useDriveImage(VALID_URL, { timeout: 100, probeFn: async () => true }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isSuccess).toBe(true);
  });
});
