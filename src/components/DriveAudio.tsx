import React, { forwardRef, useImperativeHandle } from 'react';
import { useDriveAudio } from '../hooks/useDriveAudio';
import type { DriveAudioProps } from '../types/index';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export interface DriveAudioRef {
  play: () => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

/**
 * DriveAudio - Production-ready accessible Google Drive Audio player with waveform visualization.
 */
export const DriveAudio = forwardRef<DriveAudioRef, DriveAudioProps>(function DriveAudio(
  {
    src,
    title,
    artist,
    showWaveform = true,
    className = '',
    style,
    placeholder,
    fallback,
    autoPlay,
    muted,
    onMetadataLoaded,

    onError,
    onResolveSuccess,
  },

  ref,
) {
  const {
    audioUrl,
    loading,
    error,
    metadata,
    isPlaying,
    currentTime,
    duration,
    volume,
    peaks,
    play,
    pause,
    seek,
    setVolume,
  } = useDriveAudio(src);

  useImperativeHandle(ref, () => ({
    play,
    pause,
    seek,
    setVolume,
  }));

  // Handle callbacks
  React.useEffect(() => {
    if (metadata && onMetadataLoaded) {
      onMetadataLoaded(metadata);
    }
  }, [metadata, onMetadataLoaded]);

  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  React.useEffect(() => {
    if (audioUrl && onResolveSuccess && metadata) {
      onResolveSuccess({
        audioUrl,
        fileId: src,
        attemptedEndpoints: [],
        successfulEndpoint: audioUrl,
        fromCache: false,
        metadata,
      });
    }
  }, [audioUrl, onResolveSuccess, metadata, src]);

  // Handle autoPlay & muted
  React.useEffect(() => {
    if (muted) setVolume(0);
  }, [muted, setVolume]);

  React.useEffect(() => {
    if (autoPlay && audioUrl) {
      play().catch(() => {});
    }
  }, [autoPlay, audioUrl, play]);

  if (loading) {
    return (
      <div
        className={`driveloader-audio-loading ${className}`}
        style={{
          padding: '1rem',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          ...style,
        }}
      >
        {placeholder || <span>Loading Drive Audio...</span>}
      </div>
    );
  }

  if (error || !audioUrl) {
    return (
      <div
        className={`driveloader-audio-error ${className}`}
        style={{
          padding: '1rem',
          background: 'rgba(239,68,68,0.1)',
          color: '#ef4444',
          borderRadius: '8px',
          ...style,
        }}
      >
        {fallback || <span>Failed to load audio: {error?.message || 'Unknown error'}</span>}
      </div>
    );
  }

  const trackTitle = title || metadata?.title || 'Google Drive Audio';
  const trackArtist = artist || metadata?.artist || 'Drive Media';

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={`Audio Player: ${trackTitle}`}
      className={`driveloader-audio-player ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '1rem',
        borderRadius: '12px',
        background: '#18181b',
        color: '#f4f4f5',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)',
        ...style,
      }}
      onKeyDown={(e) => {
        if (e.key === ' ') {
          e.preventDefault();
          isPlaying ? pause() : play();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          seek(Math.min(duration, currentTime + 5));
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          seek(Math.max(0, currentTime - 5));
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{trackTitle}</div>
          <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>{trackArtist}</div>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#a1a1aa', fontFamily: 'monospace' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {showWaveform && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            height: '36px',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const ratio = clickX / rect.width;
            seek(ratio * duration);
          }}
        >
          {peaks.map((peak, idx) => {
            const progress = duration > 0 ? currentTime / duration : 0;
            const barProgress = idx / peaks.length;
            const isActive = barProgress <= progress;
            return (
              <div
                key={idx}
                style={{
                  flex: 1,
                  height: `${peak}%`,
                  backgroundColor: isActive ? '#3b82f6' : '#3f3f46',
                  borderRadius: '2px',
                  transition: 'height 0.2s ease, background-color 0.2s ease',
                }}
              />
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          onClick={() => (isPlaying ? pause() : play())}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>

        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          aria-label="Seek time"
          onChange={(e) => seek(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#3b82f6', cursor: 'pointer' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', width: '90px' }}>
          <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>🔊</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            aria-label="Volume"
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{ width: '60px', accentColor: '#3b82f6', cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
});
