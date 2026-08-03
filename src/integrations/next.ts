import { extractFileId } from '../core/parser';
import { resolveDriveImage } from '../core/resolver';
import type { ResolveOptions, ResolveResult } from '../types/index';

export interface NextImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

/**
 * Creates a custom loader function for Next.js `<Image>` component.
 *
 * @example
 * ```tsx
 * import Image from 'next/image';
 * import { createDriveNextLoader } from '@driveloader/react';
 *
 * <Image loader={createDriveNextLoader()} src="DRIVE_URL" width={800} height={600} alt="Next Image" />
 * ```
 */
export function createDriveNextLoader() {
  return ({ src, width }: NextImageLoaderProps): string => {
    const fileId = extractFileId(src);
    if (!fileId) return src;
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
  };
}

/**
 * Server-side resolution helper for Next.js Server Components, Server Actions, and Edge Runtime.
 */
export async function resolveDriveImageServer(
  src: string,
  options?: ResolveOptions,
): Promise<ResolveResult> {
  return resolveDriveImage(src, options);
}

/**
 * Helper to validate Drive URL inside Server Actions or API routes.
 */
export function isDriveUrlServerAction(url: string): boolean {
  return Boolean(extractFileId(url));
}
