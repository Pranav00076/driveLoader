import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DriveImage } from '../components/DriveImage';
import { defaultCache } from '../cache/MemoryCache';

describe('DriveImage Component', () => {
  const VALID_ID = '1A2b3C4d5E6f7G8h9I0j1K2L3M4N5O6P';
  const VALID_URL = `https://drive.google.com/file/d/${VALID_ID}/view`;

  beforeEach(() => {
    defaultCache.clear();
  });

  it('should render skeleton placeholder while resolving', () => {
    const { container } = render(<DriveImage src={VALID_URL} alt="Test Image" lazy={false} />);
    expect(container.querySelector('.driveloader-placeholder')).not.toBeNull();
  });

  it('should render resolved image element when resolution completes', async () => {
    render(<DriveImage src={VALID_URL} alt="Test Image" lazy={false} />);

    await waitFor(() => {
      const img = screen.getByAltText('Test Image') as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img.src).toContain(VALID_ID);
    });
  });

  it('should render custom fallback UI when link resolution fails', async () => {
    render(
      <DriveImage
        src="invalid-link"
        alt="Invalid Image"
        lazy={false}
        fallback={<div data-testid="custom-fallback">Failed to load</div>}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    });
  });
});
