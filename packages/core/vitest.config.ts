import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    environmentOptions: {
      jsdom: {
        // 确保 JSDOM 环境支持现代 Web API
        resources: 'usable',
        runScripts: 'dangerously',
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'test/', '**/*.d.ts', '**/*.test.ts', '**/*.config.ts'],
    },
  },
});
