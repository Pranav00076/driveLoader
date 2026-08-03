import { useCallback, useEffect, useRef, useState } from 'react';
import { resolveDriveAudio } from '../core/audioResolver';
import type { DriveAudioMetadata, UseDriveAudioResult } from '../types/index';

/**
 * Custom React hook for loading, controlling, and analyzing Google Drive audio tracks.
 *
 * @param src - Google Drive audio link or file ID.
 * @returns UseDriveAudioResult containing audio state, playback controls, and peak data.
 */
export function useDriveAudio(src: string): UseDriveAudioResult {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [metadata, setMetadata] = useState<DriveAudioMetadata | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(1.0);
  const [peaks, setPeaks] = useState<number[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return () => {};

    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setMetadata((prev) => ({
        title: prev?.title || 'Drive Audio',
        duration: audio.duration || 0,
        mimeType: 'audio/mpeg',
      }));
    };
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const loadAudio = useCallback(async () => {
    if (!src) return;
    setLoading(true);
    setError(null);
    try {
      const res = await resolveDriveAudio(src);
      setAudioUrl(res.audioUrl);
      setMetadata(res.metadata);

      if (audioRef.current) {
        audioRef.current.src = res.audioUrl;
      }

      // Generate dummy / simulated peak amplitudes for waveform display
      const simulatedPeaks = Array.from({ length: 40 }, () => Math.floor(Math.random() * 80 + 20));
      setPeaks(simulatedPeaks);
      setLoading(false);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      setLoading(false);
    }
  }, [src]);

  useEffect(() => {
    loadAudio();
  }, [loadAudio]);

  const play = useCallback(async () => {
    if (audioRef.current) {
      await audioRef.current.play();
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);

  return {
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
    reload: loadAudio,
  };
}
