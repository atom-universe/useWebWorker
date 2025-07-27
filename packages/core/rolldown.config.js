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
    tryCatchDeoptimization: true, // 开启更激进的优化
  },
  mangleProps: /^_/,
  target: 'es2022', // 更现代的目标，减少 polyfill
  define: {
    'process.env.NODE_ENV': '"production"',
  },
};
