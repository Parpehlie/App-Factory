#!/usr/bin/env node
/**
 * create-app — clone apps/_template into a new app.
 *
 *   pnpm create-app <name> <bundleId>
 *   e.g. pnpm create-app demo com.me.demo
 *
 * Substitutes: package name, app display name, slug, iOS bundle id,
 * Android package, and URL scheme. Zero dependencies.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const TEMPLATE_DIR = path.join(REPO_ROOT, 'apps', '_template');

const SKIP = new Set(['node_modules', '.expo', '.turbo', 'dist', 'ios', 'android', '.env']);

function fail(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

function titleCase(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function main() {
  const [name, bundleId] = process.argv.slice(2);

  if (!name || !bundleId) {
    fail('Usage: pnpm create-app <name> <bundleId>   (e.g. pnpm create-app demo com.me.demo)');
  }
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    fail(`Invalid app name "${name}". Use lowercase letters, digits and dashes (e.g. "habit-tracker").`);
  }
  if (!/^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/.test(bundleId)) {
    fail(`Invalid bundle id "${bundleId}". Use reverse-DNS with 2+ segments (e.g. "com.me.demo").`);
  }

  if (!fs.existsSync(TEMPLATE_DIR)) {
    fail(`Template not found at ${TEMPLATE_DIR}`);
  }

  const destDir = path.join(REPO_ROOT, 'apps', name);
  if (fs.existsSync(destDir)) {
    fail(`apps/${name} already exists. Pick another name or delete it first.`);
  }

  const displayName = titleCase(name);
  const scheme = name.replace(/-/g, '');

  // 1. Copy the template tree, skipping build/output/secret dirs.
  fs.cpSync(TEMPLATE_DIR, destDir, {
    recursive: true,
    filter: (src) => {
      const rel = path.relative(TEMPLATE_DIR, src);
      if (!rel) return true;
      const first = rel.split(path.sep)[0];
      return !SKIP.has(first) && !SKIP.has(path.basename(src));
    },
  });

  // 2. Rewrite package.json name.
  const pkgPath = path.join(destDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.name = name;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

  // 3. Rewrite the identity block in app.config.ts.
  const cfgPath = path.join(destDir, 'app.config.ts');
  let cfg = fs.readFileSync(cfgPath, 'utf8');
  const subs = [
    [/const APP_NAME = '[^']*';/, `const APP_NAME = '${displayName}';`],
    [/const APP_SLUG = '[^']*';/, `const APP_SLUG = '${name}';`],
    [/const IOS_BUNDLE_ID = '[^']*';/, `const IOS_BUNDLE_ID = '${bundleId}';`],
    [/const ANDROID_PACKAGE = '[^']*';/, `const ANDROID_PACKAGE = '${bundleId}';`],
    [/const SCHEME = '[^']*';/, `const SCHEME = '${scheme}';`],
  ];
  for (const [re, rep] of subs) {
    if (!re.test(cfg)) fail(`Could not find ${re} in app.config.ts — template format changed?`);
    cfg = cfg.replace(re, rep);
  }
  fs.writeFileSync(cfgPath, cfg);

  console.log(`\n✔ Created apps/${name}`);
  console.log(`  name:      ${displayName}`);
  console.log(`  slug:      ${name}`);
  console.log(`  bundle id: ${bundleId}`);
  console.log(`  scheme:    ${scheme}`);
  console.log('\nNext steps:');
  console.log('  1) pnpm install                       # link the new workspace app');
  console.log(`  2) cp apps/${name}/.env.example apps/${name}/.env   # then fill your keys`);
  console.log(`  3) pnpm --filter ${name} start         # Metro (Expo Go for UI; dev build for purchases)`);
  console.log('');
}

main();
