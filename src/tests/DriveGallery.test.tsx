import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { DriveGallery } from '../components/DriveGallery';
import { defaultCache } from '../cache/MemoryCache';

describe('DriveGallery Component', () => {
  const VALID_URLS = [
    'https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j1K2L3M4N5O6P/view',
    'https://drive.google.com/open?id=2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7Q',
  ];

  beforeEach(() => {
    defaultCache.clear();
  });

  it('should render gallery container and items', () => {
    const { container } = render(<DriveGallery images={VALID_URLS} columns={2} gap="1rem" />);
    expect(container.querySelector('.driveloader-gallery-grid')).not.toBeNull();
    const items = container.querySelectorAll('.driveloader-gallery-item');
    expect(items.length).toBe(2);
  });

  it('should fire onImageClick when a gallery item is clicked', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <DriveGallery images={VALID_URLS} columns={2} onImageClick={handleClick} />,
    );

    const items = container.querySelectorAll('.driveloader-gallery-item');
    if (items[0]) {
      fireEvent.click(items[0]);
      expect(handleClick).toHaveBeenCalledTimes(1);
    }
  });
});
