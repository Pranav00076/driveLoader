export { createDriveNextLoader, resolveDriveImageServer, isDriveUrlServerAction } from './next';

/**
 * Vite integration helper.
 */
export function viteDrivePlugin() {
  return {
    name: 'driveloader-vite-plugin',
    config() {
      return {
        define: {
          'process.env.DRIVELOADER_BUILD': JSON.stringify('vite'),
        },
      };
    },
  };
}

/**
 * Remix / Astro / TanStack Start server loader helper.
 */
export async function loadDriveMediaServer(src: string) {
  const { resolveDriveImage } = await import('../core/resolver');
  return resolveDriveImage(src);
}
