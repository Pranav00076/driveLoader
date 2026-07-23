import React from 'react';
import { DriveImage } from './DriveImage.js';
import type { DriveGalleryProps, DriveGalleryItem } from '../types/index.js';

/**
 * DriveGallery Component
 *
 * A lightweight, responsive grid gallery for displaying collections of Google Drive images.
 * Automatically resolves all image links, supports responsive column layouts, lazy loading,
 * custom gap spacing, and click callbacks.
 *
 * @example
 * ```tsx
 * <DriveGallery
 *   images={[
 *     'https://drive.google.com/file/d/ID_1/view',
 *     'https://drive.google.com/file/d/ID_2/view',
 *   ]}
 *   columns={{ sm: 1, md: 2, lg: 3 }}
 *   gap="1.5rem"
 *   onImageClick={(item, index) => console.log('Clicked image:', index)}
 * />
 * ```
 */
export const DriveGallery: React.FC<DriveGalleryProps> = ({
  images,
  columns = 3,
  gap = '1rem',
  className = '',
  style,
  lazy = true,
  placeholder,
  fallback,
  onImageClick,
}) => {
  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }

  const normalizedItems: DriveGalleryItem[] = images.map((item) =>
    typeof item === 'string' ? { src: item, alt: '' } : item,
  );

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
          onClick={() => onImageClick && onImageClick(item, index)}
        >
          <DriveImage
            src={item.src}
            alt={item.alt || `Gallery Image ${index + 1}`}
            lazy={lazy}
            placeholder={placeholder}
            fallback={fallback}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  );
};
