module.exports = {
  entry: {
    index: 'src/index.ts',
    'cli/index': 'src/cli/index.ts',
  },
  format: ['cjs', 'esm'],

  dts: true,
  clean: true,
  sourcemap: true,
  minify: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  banner: {
    js: '/* @driveloader/react v1.2.0 | MIT License | https://github.com/Pranav00076/driveLoader */',
  },
  onSuccess: 'cp src/styles.css dist/styles.css 2>/dev/null || true',
};
