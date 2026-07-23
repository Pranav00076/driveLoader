import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  banner: {
    js: '/* @driveloader/react v1.0.0 | MIT License | https://github.com/Pranav00076/driveLoader */',
  },
  onSuccess: 'cp src/styles.css dist/styles.css 2>/dev/null || true',
});
