import { readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MIN_RENDERED_FONT_SIZE = 12;

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === 'node_modules' || entry.name === '.expo') return [];
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return ['.ts', '.tsx'].includes(extname(entry.name)) ? [path] : [];
  });
}

describe('readability — core product promise for the 50+ audience', () => {
  it(`does not render text below ${MIN_RENDERED_FONT_SIZE}px`, () => {
    const violations: string[] = [];
    const pattern = /fontSize\s*:\s*(\d+(?:\.\d+)?)/g;

    for (const file of sourceFiles(APP_ROOT)) {
      const source = readFileSync(file, 'utf8');
      for (const match of source.matchAll(pattern)) {
        const size = Number(match[1]);
        if (size < MIN_RENDERED_FONT_SIZE) {
          const line = source.slice(0, match.index).split('\n').length;
          violations.push(`${relative(APP_ROOT, file)}:${line} uses ${size}px`);
        }
      }
    }

    expect(violations, violations.join('\n')).toEqual([]);
  });
});
