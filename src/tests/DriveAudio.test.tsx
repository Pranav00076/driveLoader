import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DriveAudio } from '../components/DriveAudio';
import { DrivePlaylist } from '../components/DrivePlaylist';

describe('DriveAudio Component', () => {
  it('should render loading state initially or resolved player', async () => {
    render(
      <DriveAudio
        src="https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j/view"
        title="Test Track"
      />,
    );
    expect(screen.getByText(/Loading Drive Audio...|Test Track/i)).toBeInTheDocument();
  });
});

describe('DrivePlaylist Component', () => {
  it('should render playlist tracks', () => {
    const tracks = [
      'https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j/view',
      'https://drive.google.com/file/d/2B3c4D5e6F7g8H9i0J1k/view',
    ];
    render(<DrivePlaylist tracks={tracks} />);
    expect(screen.getByText(/Track 1 of 2/i)).toBeInTheDocument();
  });
});
