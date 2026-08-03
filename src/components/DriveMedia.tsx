import React from 'react';
import { detectMediaType } from '../core/parser';
import { DriveAudio } from './DriveAudio';
import { DriveDocument } from './DriveDocument';
import { DriveImage } from './DriveImage';
import { DriveVideo } from './DriveVideo';
import type { DriveMediaProps, MediaType } from '../types/index';

/**
 * DriveMedia - Universal Google Drive media component.
 * Automatically detects whether the asset is an Image, Video, Audio track, or Document
 * and renders the corresponding optimized component.
 */
export const DriveMedia: React.FC<DriveMediaProps> = ({
  src,
  type = 'auto',
  alt = 'Google Drive Media',
  width,
  height,
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  className = '',
  style,
  placeholder,
  fallback,
  objectFit,
  onLoad,
  onError,
}) => {
  const resolvedType: MediaType =
    type === 'auto' || !type ? detectMediaType(src) : (type as MediaType);

  switch (resolvedType) {
    case 'video':
      return (
        <DriveVideo
          src={src}
          width={width}
          height={height}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          className={className}
          style={style}
          placeholder={placeholder}
          fallback={fallback}
          onError={onError}
        />
      );

    case 'audio':
      return (
        <DriveAudio
          src={src}
          autoPlay={autoPlay}
          muted={muted}
          className={className}
          style={style}
          placeholder={placeholder}
          fallback={fallback}
          onError={onError}
        />
      );

    case 'document':
      return (
        <DriveDocument
          src={src}
          width={width || '100%'}
          height={height || '500px'}
          className={className}
          style={style}
          placeholder={placeholder}
          fallback={fallback}
          onError={onError}
        />
      );

    case 'image':
    default:
      return (
        <DriveImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          style={{ objectFit, ...style }}
          placeholder={placeholder}
          fallback={fallback}
          onLoad={(e) => onLoad && onLoad(e)}
          onError={(err) => onError && onError(err)}
        />
      );
  }
};
