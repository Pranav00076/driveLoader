import { useCallback, useState } from 'react';
import type { DrivePlaylistItem } from '../types/index';

export interface UseDrivePlaylistResult {
  currentTrackIndex: number;
  currentTrack: DrivePlaylistItem | null;
  nextTrack: () => void;
  prevTrack: () => void;
  selectTrack: (index: number) => void;
  tracks: DrivePlaylistItem[];
}

export function useDrivePlaylist(
  rawTracks: Array<string | DrivePlaylistItem>,
  initialTrackIndex = 0,
  _autoAdvance = true,
  loop = false,
): UseDrivePlaylistResult {
  const normalizedTracks: DrivePlaylistItem[] = rawTracks.map((t, idx) =>
    typeof t === 'string' ? { src: t, title: `Track ${idx + 1}`, artist: 'Drive Playlist' } : t,
  );

  const [currentIndex, setCurrentIndex] = useState<number>(initialTrackIndex);

  const currentTrack = normalizedTracks[currentIndex] || null;

  const nextTrack = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev + 1 < normalizedTracks.length) {
        return prev + 1;
      }
      return loop ? 0 : prev;
    });
  }, [normalizedTracks.length, loop]);

  const prevTrack = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev - 1 >= 0) {
        return prev - 1;
      }
      return loop ? normalizedTracks.length - 1 : 0;
    });
  }, [normalizedTracks.length, loop]);

  const selectTrack = useCallback(
    (index: number) => {
      if (index >= 0 && index < normalizedTracks.length) {
        setCurrentIndex(index);
      }
    },
    [normalizedTracks.length],
  );

  return {
    currentTrackIndex: currentIndex,
    currentTrack,
    nextTrack,
    prevTrack,
    selectTrack,
    tracks: normalizedTracks,
  };
}
