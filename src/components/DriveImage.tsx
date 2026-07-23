import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useDriveImage } from '../hooks/useDriveImage.js';
import { useDriveLoaderConfig } from '../context/DriveLoaderContext.js';
import type { DriveImageProps } from '../types/index.js';

export interface DriveImageRef {
  imageElement: HTMLImageElement | null;
  reload: () => void;
}

/**
 * DriveImage Component
 *
 * Automatically resolves Google Drive links into direct, high-performance working CDN images.
 * Features built-in caching, automatic endpoint retry, placeholder skeleton, fallback UI,
 * IntersectionObserver lazy loading, and smooth fade-in animations.
 *
 * @example
 * ```tsx
 * <DriveImage
 *   src="https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j/view"
 *   alt="Product Showcase"
 *   width={400}
 *   height={300}
 *   fade={true}
 * />
 * ```
 */
export const DriveImage = forwardRef<DriveImageRef, DriveImageProps>(function DriveImage(
  {
    src,
    alt = '',
    width,
    height,
    className = '',
    style,
    placeholder,
    fallback,
    loading: htmlLoading,
    cache = true,
    lazy: lazyProp,
    fade: fadeProp,
    crossOrigin,
    referrerPolicy = 'no-referrer',
    onLoad,
    onError,
    onResolveSuccess,
    onResolveError,
    ...restImgProps
  },
  ref,
) {
  const globalConfig = useDriveLoaderConfig();

  const lazy = lazyProp ?? globalConfig.lazy ?? true;
  const fade = fadeProp ?? true;

  const [isVisible, setIsVisible] = useState(!lazy);
  const [isDomLoaded, setIsDomLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

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
  const { imageUrl, loading: isResolving, error, reload } = useDriveImage(activeSrc, { cache });

  useEffect(() => {
    if (error && onResolveError) {
      onResolveError(error);
    }
  }, [error, onResolveError]);

  useImperativeHandle(ref, () => ({
    imageElement: imgRef.current,
    reload: () => {
      setIsDomLoaded(false);
      reload({ bypassCache: true });
    },
  }));

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsDomLoaded(true);
    if (onLoad) {
      onLoad(e);
    }
    if (onResolveSuccess && imageUrl) {
      onResolveSuccess({
        imageUrl,
        fileId: src,
        attemptedEndpoints: [imageUrl],
        successfulEndpoint: imageUrl,
        fromCache: false,
        learned: false,
      });
    }
  };

  const handleImgError = (_e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const err = new Error(`Failed to load image element for resolved URL: "${imageUrl}"`);
    if (onError) {
      onError(err);
    }
  };

  // Render Fallback if resolution fails or DOM image load errors out
  if (error) {
    if (fallback !== undefined) {
      return <>{fallback}</>;
    }
    if (globalConfig.fallback !== undefined) {
      return <>{globalConfig.fallback}</>;
    }

    return (
      <div className="driveloader-fallback" style={style}>
        <span>Unable to load Google Drive image</span>
      </div>
    );
  }

  const effectivePlaceholder = placeholder ?? globalConfig.placeholder;

  return (
    <div
      ref={containerRef}
      className={`driveloader-container ${className}`.trim()}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: width ? typeof width === 'number' ? `${width}px` : width : 'auto',
        height: height ? typeof height === 'number' ? `${height}px` : height : 'auto',
        ...style,
      }}
    >
      {(isResolving || (!isDomLoaded && imageUrl)) && (
        effectivePlaceholder ? (
          <>{effectivePlaceholder}</>
        ) : (
          <div
            className="driveloader-placeholder"
            style={{
              width: width ? typeof width === 'number' ? `${width}px` : width : '100%',
              height: height ? typeof height === 'number' ? `${height}px` : height : '200px',
            }}
          />
        )
      )}

      {imageUrl && isVisible && (
        <img
          ref={imgRef}
          src={imageUrl}
          alt={alt}
          width={width}
          height={height}
          loading={htmlLoading || (lazy ? 'lazy' : 'eager')}
          crossOrigin={crossOrigin}
          referrerPolicy={referrerPolicy}
          onLoad={handleImgLoad}
          onError={handleImgError}
          className={`driveloader-image ${
            fade ? (isDomLoaded ? 'driveloader-image-loaded' : 'driveloader-image-loading') : ''
          }`.trim()}
          style={{
            width: width ? typeof width === 'number' ? `${width}px` : width : '100%',
            height: height ? typeof height === 'number' ? `${height}px` : height : 'auto',
            display: !isDomLoaded && effectivePlaceholder ? 'none' : 'block',
          }}
          {...restImgProps}
        />
      )}
    </div>
  );
});
