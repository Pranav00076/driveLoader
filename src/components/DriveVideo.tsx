import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useDriveVideo } from '../hooks/useDriveVideo';
import { useDriveLoaderConfig } from '../context/DriveLoaderContext';
import { getVideoThumbnail } from '../core/videoMetadata';
import type { DriveVideoProps, DriveVideoMetadata } from '../types/index';

export interface DriveVideoRef {
  videoElement: HTMLVideoElement | null;
  reload: () => void;
}

/**
 * DriveVideo Component
 *
 * Automatically resolves Google Drive video links into direct, high-performance CDN streaming URLs.
 * Features built-in caching, automatic endpoint retry, skeleton placeholders, fallback UI,
 * automatic poster generation, IntersectionObserver lazy loading, and full HTML5 video event support.
 *
 * @example
 * ```tsx
 * <DriveVideo
 *   src="https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j/view"
 *   controls
 *   autoPlay={false}
 *   preload="metadata"
 *   width={640}
 *   height={360}
 * />
 * ```
 */
export const DriveVideo = forwardRef<DriveVideoRef, DriveVideoProps>(function DriveVideo(
  {
    src,
    width,
    height,
    className = '',
    style,
    placeholder,
    fallback,
    controls = true,
    autoPlay = false,
    muted = false,
    loop = false,
    playsInline = true,
    poster: customPoster,
    preload = 'metadata',
    crossOrigin,
    referrerPolicy = 'no-referrer',
    cache = true,
    lazy: lazyProp,
    fade: fadeProp,
    onPlay,
    onPause,
    onEnded,
    onLoadedMetadata,
    onCanPlay,
    onError,
    onResolveSuccess,
    onResolveError,
    ...restVideoProps
  },
  ref,
) {
  const globalConfig = useDriveLoaderConfig();

  const lazy = lazyProp ?? globalConfig.lazy ?? true;
  const fade = fadeProp ?? true;

  const [isVisible, setIsVisible] = useState(!lazy);
  const [isDomLoaded, setIsDomLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    if (!lazy || isVisible) return;

    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [lazy, isVisible]);

  // Only resolve when visible (if lazy)
  const activeSrc = isVisible ? src : '';
  const {
    videoUrl,
    loading: isResolving,
    error,
    metadata,
    thumbnailUrl,
    reload,
  } = useDriveVideo(activeSrc, { cache });

  useEffect(() => {
    if (error && onResolveError) {
      onResolveError(error);
    }
  }, [error, onResolveError]);

  useEffect(() => {
    if (videoUrl && onResolveSuccess) {
      const defaultMeta: DriveVideoMetadata = metadata || {
        duration: 0,
        width: typeof width === 'number' ? width : 1920,
        height: typeof height === 'number' ? height : 1080,
        mimeType: 'video/mp4',
        size: 0,
        thumbnailUrl: thumbnailUrl || getVideoThumbnail(src),
      };
      onResolveSuccess({
        videoUrl,
        fileId: src,
        attemptedEndpoints: [videoUrl],
        successfulEndpoint: videoUrl,
        fromCache: false,
        learned: false,
        metadata: defaultMeta,
        thumbnailUrl: thumbnailUrl || getVideoThumbnail(src),
      });
    }
  }, [videoUrl, metadata, thumbnailUrl, src, width, height, onResolveSuccess]);

  useImperativeHandle(ref, () => ({
    videoElement: videoRef.current,
    reload: () => {
      setIsDomLoaded(false);
      reload({ bypassCache: true });
    },
  }));

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setIsDomLoaded(true);
    if (onLoadedMetadata) {
      onLoadedMetadata(e, metadata || undefined);
    }
  };

  const handleVideoError = (_e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const err = new Error(`Failed to load video element for resolved URL: "${videoUrl}"`);
    if (onError) {
      onError(err);
    }
  };

  const posterUrl = customPoster || thumbnailUrl || getVideoThumbnail(src);

  // Render Fallback if resolution fails or DOM video load errors out
  if (error) {
    if (fallback !== undefined) {
      return <>{fallback}</>;
    }
    if (globalConfig.fallback !== undefined) {
      return <>{globalConfig.fallback}</>;
    }

    return (
      <div className="driveloader-fallback driveloader-video-fallback" style={style}>
        <span>Unable to load Google Drive video</span>
      </div>
    );
  }

  const effectivePlaceholder = placeholder ?? globalConfig.placeholder;

  return (
    <div
      ref={containerRef}
      className={`driveloader-container driveloader-video-container ${className}`.trim()}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: width ? (typeof width === 'number' ? `${width}px` : width) : 'auto',
        height: height ? (typeof height === 'number' ? `${height}px` : height) : 'auto',
        ...style,
      }}
    >
      {(isResolving || (!isDomLoaded && videoUrl)) &&
        (effectivePlaceholder ? (
          <>{effectivePlaceholder}</>
        ) : (
          <div
            className="driveloader-placeholder driveloader-video-placeholder"
            style={{
              width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
              height: height ? (typeof height === 'number' ? `${height}px` : height) : '240px',
            }}
          />
        ))}

      {videoUrl && isVisible && (
        <video
          ref={videoRef}
          src={videoUrl}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          poster={posterUrl}
          preload={preload}
          crossOrigin={crossOrigin}
          {...(referrerPolicy ? ({ referrerPolicy } as Record<string, string>) : {})}

          onPlay={onPlay}

          onPause={onPause}
          onEnded={onEnded}
          onLoadedMetadata={handleLoadedMetadata}
          onCanPlay={onCanPlay}
          onError={handleVideoError}
          className={`driveloader-video ${
            fade ? (isDomLoaded ? 'driveloader-video-loaded' : 'driveloader-video-loading') : ''
          }`.trim()}
          style={{
            width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
            height: height ? (typeof height === 'number' ? `${height}px` : height) : 'auto',
            display: !isDomLoaded && effectivePlaceholder ? 'none' : 'block',
          }}
          {...restVideoProps}
        />
      )}
    </div>
  );
});
