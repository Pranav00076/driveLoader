import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DriveMedia } from '../components/DriveMedia';

describe('DriveMedia Universal Component', () => {
  it('should auto-detect image media type and render DriveImage container', () => {
    const { container } = render(
      <DriveMedia
        src="https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j1K2L3M4N5O/view"
        alt="Test Photo"
      />,
    );
    expect(container.querySelector('.driveloader-container')).toBeInTheDocument();
  });

  it('should auto-detect video media type and render DriveVideo container', () => {
    const { container } = render(
      <DriveMedia src="https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j1K2L3M4N5O/view?type=video" />,
    );
    expect(container.querySelector('.driveloader-video-container')).toBeInTheDocument();
  });

  it('should auto-detect audio media type and render DriveAudio', () => {
    render(
      <DriveMedia src="https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j1K2L3M4N5O/view?type=audio" />,
    );
    expect(screen.getByText(/Loading Drive Audio...|Google Drive Audio/i)).toBeInTheDocument();
  });
});
