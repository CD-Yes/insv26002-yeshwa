// Generates public/build-info.json at build time (consumed by the admin
// System Health page). Runs in Node during `npm run build` — Date.now is fine here.
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

const info = {
  version: pkg.version ?? '0.0.0',
  builtAt: new Date().toISOString(),
  commit: (process.env.CF_PAGES_COMMIT_SHA || process.env.GITHUB_SHA || '').slice(0, 7) || 'local',
  branch: process.env.CF_PAGES_BRANCH || process.env.GITHUB_REF_NAME || 'local',
};

mkdirSync(resolve(root, 'public'), { recursive: true });
writeFileSync(resolve(root, 'public', 'build-info.json'), JSON.stringify(info, null, 2));
console.log('build-info.json generated:', info.version, info.commit);
