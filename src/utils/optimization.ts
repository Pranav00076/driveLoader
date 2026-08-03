import { useEffect, useRef, useState } from 'react';
import { prefetch } from '../core/prefetch';

export interface AdaptiveQualityOptions {
  width?: number;
  quality?: 'auto' | 'high' | 'medium' | 'low';
}

/**
 * Calculates adaptive target width and quality based on network speed (NetworkInformation API) and DPR.
 */
export function getAdaptiveQuality(defaultWidth = 1000): number {
  if (typeof window === 'undefined') return defaultWidth;

  let multiplier = 1;

  // Device Pixel Ratio adjustment
  if (window.devicePixelRatio && window.devicePixelRatio > 1) {
    multiplier = Math.min(window.devicePixelRatio, 2);
  }

  // Network connection throttling check
  const nav = navigator as unknown as {
    connection?: { effectiveType?: string; saveData?: boolean };
  };
  if (nav.connection) {
    if (nav.connection.saveData) return Math.round(defaultWidth * 0.5);
    if (nav.connection.effectiveType === '2g' || nav.connection.effectiveType === 'slow-2g') {
      return Math.round(defaultWidth * 0.4);
    }
    if (nav.connection.effectiveType === '3g') {
      return Math.round(defaultWidth * 0.7);
    }
  }

  return Math.round(defaultWidth * multiplier);
}

/**
 * Builds a responsive `srcSet` string for a Google Drive thumbnail URL across width breakpoints.
 */
export function buildResponsiveSrcSet(
  baseUrl: string,
  widths = [320, 640, 960, 1280, 1920],
): string {
  if (!baseUrl) return '';

  return widths
    .map((w) => {
      let url = baseUrl;
      if (url.includes('=w')) {
        url = url.replace(/=w\d+/, `=w${w}`);
      } else if (url.includes('sz=w')) {
        url = url.replace(/sz=w\d+/, `sz=w${w}`);
      } else {
        url = `${url}${url.includes('?') ? '&' : '?'}sz=w${w}`;
      }
      return `${url} ${w}w`;
    })
    .join(', ');
}

/**
 * Hook for observing container element resize and returning optimal target width.
 */
export function useAutoResize<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState<number>(800);

  useEffect(() => {
    if (!ref.current || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setWidth(Math.ceil(entry.contentRect.width));
        }
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

/**
 * Hook for IntersectionObserver detection.
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsIntersecting(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isIntersecting };
}

/**
 * Pre-fetches a Google Drive URL when element is hovered or focused.
 */
export function usePrefetchOnHover<T extends HTMLElement = HTMLDivElement>(url: string) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !url) return;

    const handleHover = () => {
      prefetch(url);
    };

    el.addEventListener('mouseenter', handleHover);
    el.addEventListener('focus', handleHover);

    return () => {
      el.removeEventListener('mouseenter', handleHover);
      el.removeEventListener('focus', handleHover);
    };
  }, [url]);

  return ref;
}
