import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DriveVideo } from '../index';
import { defaultCache } from '../cache/MemoryCache';

describe('DriveVideo Component', () => {
  const VALID_ID = '1A2b3C4d5E6f7G8h9I0j1K2L3M4N5O6P';
  const VALID_URL = `https://drive.google.com/file/d/${VALID_ID}/view`;

  beforeEach(() => {
    defaultCache.clear();
  });

  it('should render video container and video element after resolution', async () => {
    const { container } = render(
      <DriveVideo src={VALID_URL} controls lazy={false} width={640} height={360} />,
    );

    await waitFor(() => {
      const videoEl = container.querySelector('video');
      expect(videoEl).not.toBeNull();
      expect(videoEl?.getAttribute('src')).toBe(
        `https://drive.usercontent.google.com/download?id=${VALID_ID}&confirm=t`,
      );
      expect(videoEl?.hasAttribute('controls')).toBe(true);
    });
  });

  it('should pass HTML video attributes correctly', async () => {
    const { container } = render(
      <DriveVideo src={VALID_URL} controls muted loop playsInline preload="auto" lazy={false} />,
    );

    await waitFor(() => {
      const videoEl = container.querySelector('video');
      expect(videoEl).not.toBeNull();
      expect((videoEl as HTMLVideoElement)?.muted).toBe(true);
      expect(videoEl?.hasAttribute('loop')).toBe(true);

      expect(videoEl?.hasAttribute('playsinline')).toBe(true);
      expect(videoEl?.getAttribute('preload')).toBe('auto');
    });
  });

  it('should render custom fallback on invalid video URL', async () => {
    render(
      <DriveVideo
        src="https://invalid.com/file/d/invalid_link"
        lazy={false}
        fallback={<div data-testid="custom-video-fallback">Video Error</div>}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('custom-video-fallback')).not.toBeNull();
    });
  });
});
