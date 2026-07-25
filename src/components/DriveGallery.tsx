import React from 'react';
import { DriveImage } from './DriveImage.js';
import { DriveVideo } from './DriveVideo.js';
import { isDriveVideo } from '../core/parser.js';
import { useDriveFolder } from '../hooks/useDriveFolder.js';
import type { DriveGalleryProps, DriveAsset } from '../types/index.js';

/**
 * DriveGallery Component
 *
 * A lightweight, responsive grid gallery for displaying collections of Google Drive images and videos, or entire public Google Drive folders.
 * Automatically resolves image/video links, renders `<DriveVideo />` for video assets, supports responsive column layouts, lazy loading,
 * folder pagination, custom gap spacing, and click callbacks.
 *
 * @example
 * ```tsx
 * // Single media mode:
 * <DriveGallery
 *   images={[
 *     'https://drive.google.com/file/d/IMAGE_ID/view',
 *     'https://drive.google.com/file/d/VIDEO_ID/view?type=video',
 *   ]}
 *   columns={{ sm: 1, md: 2, lg: 3 }}
 * />
 *
 * // Folder mode (Mixed Media):
 * <DriveGallery
 *   folderUrl="https://drive.google.com/drive/folders/1a2B3c4D5e6F7g8H9i0J"
 *   apiKey="YOUR_GOOGLE_DRIVE_API_KEY"
 *   columns={4}
 * />
 * ```
 */
export const DriveGallery: React.FC<DriveGalleryProps> = ({
  images,
  folderUrl,
  folderId,
  apiKey,
  mediaTypes,
  extensions,
  orderBy,
  columns = 3,
  gap = '1rem',
  className = '',
  style,
  lazy = true,
  placeholder,
  fallback,
  onImageClick,
}) => {
  const isFolderMode = Boolean((folderUrl || folderId) && apiKey);

  const folderResult = useDriveFolder({
    folderUrl,
    folderId,
    apiKey: apiKey || '',
    mediaTypes,
    extensions,
    orderBy,
  });

  let normalizedItems: Array<{ src: string; alt: string; isVideo: boolean; asset?: DriveAsset }> =
    [];

  if (isFolderMode) {
    normalizedItems = folderResult.assets.map((asset) => {
      const isVid =
        asset.type === 'video' || isDriveVideo(asset.name) || isDriveVideo(asset.mimeType);
      return {
        src: asset.resolvedUrl || asset.driveUrl,
        alt: asset.name || '',
        isVideo: isVid,
        asset,
      };
    });
  } else if (Array.isArray(images)) {
    normalizedItems = images.map((item) => {
      const srcStr = typeof item === 'string' ? item : item.src;
      const altStr = typeof item === 'string' ? '' : item.alt || '';
      return {
        src: srcStr,
        alt: altStr,
        isVideo: isDriveVideo(srcStr),
      };
    });
  }

  if (normalizedItems.length === 0) {
    if (isFolderMode && folderResult.loading) {
      return (
        <div className={`driveloader-gallery-loading ${className}`.trim()} style={style}>
          <div className="driveloader-placeholder" style={{ width: '100%', height: '200px' }} />
        </div>
      );
    }
    return null;
  }

  let gridColsSm = 1;
  let gridColsMd = 2;
  let gridColsLg = 3;

  if (typeof columns === 'number') {
    gridColsLg = columns;
    gridColsMd = Math.max(1, Math.floor(columns / 1.5));
    gridColsSm = 1;
  } else if (typeof columns === 'object' && columns !== null) {
    gridColsSm = columns.sm ?? 1;
    gridColsMd = columns.md ?? 2;
    gridColsLg = columns.lg ?? 3;
  }

  const gapValue = typeof gap === 'number' ? `${gap}px` : gap;

  const inlineStyles: React.CSSProperties = {
    ['--driveloader-gallery-gap' as unknown as string]: gapValue,
    ['--driveloader-gallery-cols' as unknown as string]: String(gridColsLg),
    ['--driveloader-gallery-cols-md' as unknown as string]: String(gridColsMd),
    ['--driveloader-gallery-cols-sm' as unknown as string]: String(gridColsSm),
    ...style,
  };

  return (
    <div className={`driveloader-gallery-grid ${className}`.trim()} style={inlineStyles}>
      {normalizedItems.map((item, index) => (
        <div
          key={`${item.src}-${index}`}
          className="driveloader-gallery-item"
          style={{ cursor: onImageClick ? 'pointer' : 'default' }}
          onClick={() => {
            if (onImageClick) {
              if (item.asset) {
                onImageClick(item.asset, index);
              } else {
                onImageClick({ src: item.src, alt: item.alt }, index);
              }
            }
          }}
        >
          {item.isVideo ? (
            <DriveVideo
              src={item.src}
              controls
              lazy={lazy}
              placeholder={placeholder}
              fallback={fallback}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <DriveImage
              src={item.src}
              alt={item.alt || `Gallery Image ${index + 1}`}
              lazy={lazy}
              placeholder={placeholder}
              fallback={fallback}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </div>
      ))}
    </div>
  );
};
