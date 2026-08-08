import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const policy = JSON.parse(await readFile(path.join(websiteRoot, 'tools/content-policy.json'), 'utf8'));
const manifest = JSON.parse(await readFile(path.join(websiteRoot, 'generated-content-manifest.json'), 'utf8'));
const contentRoot = path.resolve(websiteRoot, policy.generatedContentRoot);
const assetsRoot = path.resolve(websiteRoot, policy.generatedAssetsRoot);
const allowedPlaceholders = new Set(policy.allowedGeneratedPlaceholders ?? []);
const toPosix = (value) => value.split(path.sep).join('/');
const digest = (value) => createHash('sha256').update(value).digest('hex');

function assertInside(child, parent, label) {
  const relative = path.relative(parent, child);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`${label} is outside its configured public root.`);
}

async function walk(root) {
  const output = [];
  try { await stat(root); } catch (error) { if (error.code === 'ENOENT') return output; throw error; }
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(absolute);
      else if (entry.isFile()) output.push(absolute);
    }
  }
  await visit(root);
  return output.sort();
}

if (manifest.schemaVersion !== 1) throw new Error('Unsupported generated manifest schema.');
if (!Array.isArray(manifest.content) || !Array.isArray(manifest.assets) || typeof manifest.redirects !== 'object') throw new Error('Generated manifest is incomplete.');

const entries = [...manifest.content, ...manifest.assets];
const ownedTargets = new Set();
for (const entry of entries) {
  if (!entry.target || !entry.sha256 || ownedTargets.has(entry.target)) throw new Error(`Invalid or duplicate generated target: ${entry.target}.`);
  const absolute = path.resolve(websiteRoot, entry.target);
  const expectedRoot = manifest.content.includes(entry) ? contentRoot : assetsRoot;
  assertInside(absolute, expectedRoot, entry.target);
  const bytes = await readFile(absolute);
  if (digest(bytes) !== entry.sha256) throw new Error(`Generated file hash mismatch: ${entry.target}.`);
  ownedTargets.add(entry.target);
}

for (const file of [...await walk(contentRoot), ...await walk(assetsRoot)]) {
  const relative = toPosix(path.relative(websiteRoot, file));
  if (!ownedTargets.has(relative) && !allowedPlaceholders.has(relative)) throw new Error(`Unowned file in generated area: ${relative}.`);
}

const routes = new Set([...policy.existingRoutes, ...manifest.content.map((entry) => entry.route)]);
const routePattern = /^\/knowledge\/legacy\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\/$/;
const markdownLinks = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
for (const entry of manifest.content) {
  if (!routePattern.test(entry.route)) throw new Error(`Generated route is outside the legacy namespace: ${entry.route}.`);
  const markdown = await readFile(path.join(websiteRoot, entry.target), 'utf8');
  if (/visibility\s*:|status\s*:|source_commit\s*:/.test(markdown.split('---', 3)[1] ?? '')) throw new Error(`Private publishing metadata leaked into ${entry.target}.`);
  for (const match of markdown.matchAll(markdownLinks)) {
    const target = decodeURI(match[1]);
    if (/^(?:https?:|mailto:|#)/.test(target)) continue;
    if (target.startsWith('/images/generated/')) {
      const assetTarget = `public${target}`;
      if (!ownedTargets.has(assetTarget)) throw new Error(`Unowned generated asset reference in ${entry.target}: ${target}.`);
    } else if (target.startsWith('/')) {
      const route = target.split('#')[0].split('?')[0];
      if (route && !routes.has(route)) throw new Error(`Unresolved public route in ${entry.target}: ${target}.`);
    } else {
      throw new Error(`Relative link is not allowed in generated content: ${entry.target}.`);
    }
  }
}

for (const [legacyUrl, route] of Object.entries(manifest.redirects)) {
  if (!legacyUrl.startsWith('/') || !routes.has(route)) throw new Error(`Invalid legacy redirect: ${legacyUrl} -> ${route}.`);
}

console.log(`Validated ${manifest.content.length} generated pages, ${manifest.assets.length} assets, and ${Object.keys(manifest.redirects).length} legacy URLs.`);
