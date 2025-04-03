export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/bundle.js',
      format: 'esm',
    },
  ],
  external: ['react'],
  minify: true,
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
  mangleProps: /^_/,
  target: 'es2020',
};
