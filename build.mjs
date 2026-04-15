/**
 * Build script: bundles index.html + src/*.ts into a single-file
 * dist/index.html suitable for GitHub Pages deployment.
 *
 * Usage: node build.mjs
 */

import { build } from 'vite';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, 'dist');

// Clean dist
rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

// Step 1: Vite builds the JS bundle
await build({
  root: __dirname,
  build: {
    outDir: resolve(distDir, 'assets'),
    emptyOutDir: true,
  },
});

// Step 2: Read the Vite-generated HTML and inline the JS
const builtHtml = readFileSync(resolve(distDir, 'assets/index.html'), 'utf-8');

// Extract the bundled <script> content
const scriptMatch = builtHtml.match(/<script[^>]*>\s*(.*?)\s*<\/script>/s);
if (!scriptMatch) {
  console.error('Could not find bundled script in built HTML');
  process.exit(1);
}
const bundledJs = scriptMatch[1];

// Read the original CSS from index.html (we keep it inline)
const srcHtml = readFileSync(resolve(__dirname, 'index.html'), 'utf-8');
const styleMatch = srcHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/);
if (!styleMatch) {
  console.error('Could not find <style> in source index.html');
  process.exit(1);
}

// Build the final single-file HTML
// Use the src index.html as base, replace the <script type="module"> with inlined JS
const finalHtml = srcHtml
  .replace(
    '<script type="module" src="/src/game.ts"></script>',
    `<script>\n${bundledJs}\n</script>`
  );

writeFileSync(resolve(distDir, 'index.html'), finalHtml, 'utf-8');
console.log(`Build complete: dist/index.html`);
console.log(`  Size: ${(Buffer.byteLength(finalHtml) / 1024).toFixed(1)} KB`);
