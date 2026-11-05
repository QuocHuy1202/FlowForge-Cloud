import { defineConfig } from 'vitest/config';

// Simple Vite plugin to strip external template/style URLs for JIT Vitest runner
function angularJitTemplatePlugin() {
  return {
    name: 'angular-jit-template-plugin',
    transform(code: string, id: string) {
      if (!id.endsWith('.ts') || id.includes('node_modules')) {
        return null;
      }
      const transformed = code
        .replace(/templateUrl:\s*['"`]([^'"`]+)['"`]/g, 'template: ""')
        .replace(/styleUrl:\s*['"`]([^'"`]+)['"`]/g, 'styles: []')
        .replace(/styleUrls:\s*\[[^\]]*\]/g, 'styles: []');

      return {
        code: transformed,
        map: null,
      };
    },
  };
}

export default defineConfig({
  plugins: [angularJitTemplatePlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
  },
});
