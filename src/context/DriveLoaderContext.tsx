import React, { createContext, useContext, useEffect, useMemo } from 'react';
import type { GlobalConfig } from '../types/index';
import { defaultCache } from '../cache/MemoryCache';
import { configureDriveLoader } from '../core/resolver';

const DriveLoaderContext = createContext<GlobalConfig>({});

export interface DriveLoaderProviderProps extends GlobalConfig {
  children: React.ReactNode;
}

/**
 * React Context Provider for configuring global defaults for all child DriveImage components and hooks.
 *
 * @example
 * ```tsx
 * <DriveLoaderProvider cacheTTL={600000} retries={3} debug={true}>
 *   <App />
 * </DriveLoaderProvider>
 * ```
 */
export const DriveLoaderProvider: React.FC<DriveLoaderProviderProps> = ({
  children,
  cacheTTL,
  maxCacheSize,
  retries,
  timeout,
  debug,
  lazy,
  placeholder,
  fallback,
}) => {
  const config = useMemo<GlobalConfig>(
    () => ({
      cacheTTL,
      maxCacheSize,
      retries,
      timeout,
      debug,
      lazy,
      placeholder,
      fallback,
    }),
    [cacheTTL, maxCacheSize, retries, timeout, debug, lazy, placeholder, fallback],
  );

  useEffect(() => {
    configureDriveLoader({
      cacheTTL,
      retries,
      timeout,
      debug,
    });
    defaultCache.configure({
      ttl: cacheTTL,
      maxSize: maxCacheSize,
    });
  }, [cacheTTL, maxCacheSize, retries, timeout, debug]);

  return <DriveLoaderContext.Provider value={config}>{children}</DriveLoaderContext.Provider>;
};

/**
 * Accesses global DriveLoader configuration from parent DriveLoaderProvider.
 */
export function useDriveLoaderConfig(): GlobalConfig {
  return useContext(DriveLoaderContext);
}
