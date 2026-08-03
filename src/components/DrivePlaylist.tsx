import React from 'react';
import { useDrivePlaylist } from '../hooks/useDrivePlaylist';
import { DriveAudio } from './DriveAudio';
import type { DrivePlaylistProps } from '../types/index';

/**
 * DrivePlaylist - Audio playlist player component for Google Drive hosted audio files.
 */
export const DrivePlaylist: React.FC<DrivePlaylistProps> = ({
  tracks,
  initialTrackIndex = 0,
  autoAdvance = true,
  loop = false,
  className = '',
  style,
  onTrackChange,
}) => {
  const {
    currentTrackIndex,
    currentTrack,
    nextTrack,
    prevTrack,
    selectTrack,
    tracks: playlistTracks,
  } = useDrivePlaylist(tracks, initialTrackIndex, autoAdvance, loop);

  React.useEffect(() => {
    if (currentTrack && onTrackChange) {
      onTrackChange(currentTrack, currentTrackIndex);
    }
  }, [currentTrack, currentTrackIndex, onTrackChange]);

  if (!currentTrack) {
    return (
      <div
        className={`driveloader-playlist-empty ${className}`}
        style={{ padding: '1rem', color: '#a1a1aa', ...style }}
      >
        No tracks in playlist.
      </div>
    );
  }

  return (
    <div
      className={`driveloader-playlist ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        background: '#09090b',
        padding: '1.25rem',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#f4f4f5',
        fontFamily: 'system-ui, sans-serif',
        ...style,
      }}
    >
      <DriveAudio
        key={currentTrack.src}
        src={currentTrack.src}
        title={currentTrack.title}
        artist={currentTrack.artist}
        autoPlay
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          onClick={prevTrack}
          style={{
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          ⏮ Previous
        </button>

        <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
          Track {currentTrackIndex + 1} of {playlistTracks.length}
        </span>

        <button
          type="button"
          onClick={nextTrack}
          style={{
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Next ⏭
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          maxHeight: '200px',
          overflowY: 'auto',
        }}
      >
        {playlistTracks.map((t, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => selectTrack(idx)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.5rem 0.75rem',

              borderRadius: '6px',
              background: idx === currentTrackIndex ? 'rgba(59,130,246,0.2)' : 'transparent',
              border: idx === currentTrackIndex ? '1px solid #3b82f6' : '1px solid transparent',
              color: idx === currentTrackIndex ? '#60a5fa' : '#d4d4d8',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <span>{t.title || `Track ${idx + 1}`}</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{t.artist}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
