// Static SEO checks: page metadata, sitemap, robots, structured data, the
// route classification and tracked files. Rendered HTML is checked against a
// production build in tests/e2e/seo.test.ts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { Metadata } from 'next';
import { SITE_URL, isRetiredPath } from '../src/lib/site';
import {
  INDEXABLE_PAGES,
  SITE_NAME,
  SOCIAL_IMAGE,
  breadcrumbJsonLd,
  fullTitle,
  organizationJsonLd,
  pageMetadata,
  websiteJsonLd,
  type IndexablePath,
} from '../src/lib/seo';
import sitemap from '../src/app/sitemap';
import robots from '../src/app/robots';
import nextConfig from '../next.config';
import { metadata as thankYouMetadata } from '../src/app/thank-you/layout';
import { metadata as goneMetadata } from '../src/app/no-longer-available/page';

const ROOT = join(__dirname, '..');
const APP_DIR = join(ROOT, 'src', 'app');
const PATHS = Object.keys(INDEXABLE_PAGES) as IndexablePath[];

// Pages that render but must never be indexed.
const NOINDEX_PAGES = ['/thank-you', '/no-longer-available'];

const appRoutes = (dir = APP_DIR): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return appRoutes(full);
    if (name !== 'page.tsx') return [];
    const route = `/${relative(APP_DIR, dir).replace(/\\/g, '/')}`;
    return [route === '/' || route === '/.' ? '/' : route.replace(/\/$/, '')];
  });

const robotsOf = (metadata: Metadata) => metadata.robots as { index?: boolean; follow?: boolean } | undefined;

test('every route is classified: indexable, noindex utility page or retired (410)', () => {
  const unclassified = appRoutes().filter(
    (route) => !(route in INDEXABLE_PAGES) && !NOINDEX_PAGES.includes(route) && !isRetiredPath(route)
  );
  assert.deepEqual(unclassified, [], 'new pages must be added to INDEXABLE_PAGES, made noindex or retired');
  for (const path of PATHS) {
    assert.ok(appRoutes().includes(path), `${path} has no page`);
    assert.ok(!isRetiredPath(path), `${path} is retired but listed as indexable`);
  }
});

test('page titles and descriptions are unique, natural and of a sensible length', () => {
  const titles = PATHS.map(fullTitle);
  const descriptions = PATHS.map((p) => INDEXABLE_PAGES[p].description);
  assert.equal(new Set(titles).size, titles.length, 'duplicate title');
  assert.equal(new Set(descriptions).size, descriptions.length, 'duplicate description');
  for (const path of PATHS) {
    const title = fullTitle(path);
    assert.equal(title.split(SITE_NAME).length - 1, 1, `${path}: brand appears more than once in "${title}"`);
    assert.ok(title.length <= 70, `${path}: title is ${title.length} characters`);
    const { description } = INDEXABLE_PAGES[path];
    assert.ok(description.length >= 70 && description.length <= 180, `${path}: description is ${description.length} characters`);
    assert.ok(!/guarantee/i.test(description), `${path}: description promises outcomes`);
  }
});

test('pageMetadata gives each page a matching canonical, Open Graph and X card', () => {
  for (const path of PATHS) {
    const meta = pageMetadata(path);
    const title = fullTitle(path);
    assert.deepEqual(meta.title, { absolute: title });
    assert.equal(meta.alternates?.canonical, path);
    const og = meta.openGraph as Record<string, unknown>;
    assert.equal(og.url, path);
    assert.equal(og.title, title);
    assert.equal(og.description, INDEXABLE_PAGES[path].description);
    assert.equal(og.siteName, SITE_NAME);
    assert.equal(og.type, 'website');
    assert.deepEqual(og.images, [SOCIAL_IMAGE]);
    const tw = meta.twitter as Record<string, unknown>;
    assert.equal(tw.card, 'summary_large_image');
    assert.equal(tw.title, title);
    assert.deepEqual(tw.images, [SOCIAL_IMAGE]);
    assert.equal(meta.robots, undefined, `${path} must inherit the indexable default`);
    assert.equal((meta as Record<string, unknown>).keywords, undefined, `${path}: no meta keywords`);
  }
  assert.deepEqual({ width: SOCIAL_IMAGE.width, height: SOCIAL_IMAGE.height }, { width: 1200, height: 630 });
});

test('every indexable page source uses pageMetadata and renders breadcrumbs or organisation data', () => {
  for (const path of PATHS) {
    const dir = join(APP_DIR, ...path.split('/').filter(Boolean));
    const source = ['page.tsx', 'layout.tsx']
      .map((name) => join(dir, name))
      .filter((file) => existsSync(file) && (path !== '/' || file.endsWith('page.tsx')))
      .map((file) => readFileSync(file, 'utf8'))
      .join('\n');
    assert.ok(source.includes(`pageMetadata('${path}')`), `${path}: metadata`);
    const jsonLd = path === '/' ? 'organizationJsonLd()' : `breadcrumbJsonLd('${path}')`;
    assert.ok(source.includes(jsonLd), `${path}: structured data`);
  }
});

// The root layout imports next/font and CSS, so it is checked as source.
test('the root layout is indexable by default but claims no canonical or og:url of its own', () => {
  const layout = readFileSync(join(APP_DIR, 'layout.tsx'), 'utf8');
  const metadata = layout.slice(layout.indexOf('export const metadata'), layout.indexOf('export default'));
  assert.match(metadata, /metadataBase: new URL\(SITE_URL\)/);
  assert.match(metadata, /robots: \{\s*index: true,\s*follow: true/);
  assert.ok(!/canonical|\burl:|keywords|images:/.test(metadata), 'root metadata must not set canonical, og:url, keywords or images');
  assert.match(layout, /<html lang="en"/);
});

test('confirmation and retired-route pages are noindex', () => {
  for (const meta of [thankYouMetadata, goneMetadata]) {
    assert.equal(robotsOf(meta)?.index, false);
  }
});

test('sitemap lists exactly the indexable pages with absolute https URLs and real dates', () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);
  assert.equal(new Set(urls).size, urls.length, 'duplicate URL');
  assert.deepEqual(
    urls,
    PATHS.map((p) => (p === '/' ? SITE_URL : `${SITE_URL}${p}`))
  );
  const today = new Date().toISOString().slice(0, 10);
  for (const entry of entries) {
    assert.match(entry.url, /^https:\/\/www\.vedascholars\.com(\/[a-z-]+)?$/);
    const path = new URL(entry.url).pathname;
    assert.ok(!isRetiredPath(path) && !NOINDEX_PAGES.includes(path), `${path} must not be listed`);
    assert.match(String(entry.lastModified), /^\d{4}-\d{2}-\d{2}$/, 'lastModified is a fixed content date');
    assert.ok(String(entry.lastModified) <= today, `${entry.url}: lastModified is in the future`);
  }
});

test('robots.txt allows production crawling, references the sitemap and blocks previews', () => {
  const previous = process.env.VERCEL_ENV;
  try {
    for (const env of [undefined, 'production']) {
      if (env) process.env.VERCEL_ENV = env;
      else delete process.env.VERCEL_ENV;
      const result = robots();
      const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
      assert.equal(rules.length, 1);
      assert.equal(rules[0].userAgent, '*');
      assert.equal(rules[0].allow, '/');
      assert.deepEqual(rules[0].disallow, ['/api/']);
      assert.equal(result.sitemap, `${SITE_URL}/sitemap.xml`);
    }
    process.env.VERCEL_ENV = 'preview';
    const preview = robots();
    assert.deepEqual(preview.rules, { userAgent: '*', disallow: '/' });
    assert.equal(preview.sitemap, undefined);
  } finally {
    if (previous === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous;
  }
});

test('legacy aliases redirect permanently to public pages, and only the canonical host is indexable', async () => {
  const redirects = await nextConfig.redirects!();
  assert.deepEqual(
    redirects.map((r) => [r.source, r.destination, r.permanent]),
    [
      ['/counselling', '/contact?type=student', true],
      ['/book-counselling', '/contact?type=student', true],
      ['/get-started', '/contact?type=student', true],
      ['/partner', '/contact?type=partner', true],
    ]
  );
  for (const { source, destination } of redirects) {
    assert.ok(!appRoutes().includes(source), `${source} still has a page`);
    assert.ok(new URL(destination, SITE_URL).pathname in INDEXABLE_PAGES, `${destination} is not indexable`);
  }
  const headers = await nextConfig.headers!();
  const noindex = headers.find((h) => h.headers.some((x) => x.key === 'X-Robots-Tag'));
  assert.ok(noindex, 'non-canonical hosts must send X-Robots-Tag');
  assert.deepEqual(noindex.missing, [{ type: 'host', value: new URL(SITE_URL).host }]);
});

test('structured data uses only published business facts and valid absolute URLs', () => {
  const org = organizationJsonLd();
  const site = websiteJsonLd();
  for (const data of [org, site, ...PATHS.filter((p) => p !== '/').map((p) => breadcrumbJsonLd(p as Exclude<IndexablePath, '/'>))]) {
    const json = JSON.stringify(data);
    assert.deepEqual(JSON.parse(json), data);
    assert.equal(data['@context'], 'https://schema.org');
    assert.ok(!/aggregateRating|review|address|award|accreditation|alumniOf|FAQPage/i.test(json), json);
    for (const url of json.match(/https?:\/\/[^"]+/g) || []) assert.ok(url.startsWith('https://'), url);
  }
  assert.equal(org['@type'], 'Organization');
  assert.equal(org.url, SITE_URL);
  assert.ok(existsSync(join(ROOT, 'public', new URL(org.logo).pathname)), 'logo file exists');
  const footer = readFileSync(join(ROOT, 'src', 'components', 'layout', 'Footer.tsx'), 'utf8');
  for (const profile of org.sameAs) assert.ok(footer.includes(profile), `${profile} is not on the website`);
  assert.ok(footer.includes(org.email) && footer.includes(org.telephone), 'contact details match the footer');
  const crumbs = breadcrumbJsonLd('/for-parents');
  assert.deepEqual(
    crumbs.itemListElement.map((i) => [i.position, i.name, i.item]),
    [
      [1, 'Home', SITE_URL],
      [2, 'For Parents', `${SITE_URL}/for-parents`],
    ]
  );
});

test('the social preview image is generated at 1200 x 630 from committed assets', () => {
  const source = readFileSync(join(APP_DIR, 'opengraph-image.tsx'), 'utf8');
  assert.match(source, /export const size = \{ width: 1200, height: 630 \}/);
  assert.match(source, /export const contentType = 'image\/png'/);
  for (const file of source.match(/'(public|src)\/[^']+'/g) || []) {
    assert.ok(existsSync(join(ROOT, file.slice(1, -1))), `${file} missing`);
  }
  assert.ok(!existsSync(join(APP_DIR, 'opengraph-image.png')), 'a static opengraph-image.png would override the generated one');
});

test('no credentials or environment files are tracked by git', () => {
  const tracked = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);
  const envFiles = tracked.filter((f) => /(^|\/)\.env/.test(f) && !f.endsWith('.env.example'));
  assert.deepEqual(envFiles, []);
  const secret =
    /mongodb(\+srv)?:\/\/[^\s'"<>:]+:[^\s'"<>@]{6,}@[a-z0-9.-]+\.mongodb\.net|\bre_[A-Za-z0-9_]{20,}|AIza[0-9A-Za-z_-]{35}|GOCSPX-[A-Za-z0-9_-]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----/;
  const problems = tracked.filter((file) => {
    if (/\.(png|jpe?g|webp|ico|woff2?|ttf|gif|pdf)$/i.test(file) || file.endsWith('package-lock.json')) return false;
    const full = join(ROOT, file);
    return existsSync(full) && secret.test(readFileSync(full, 'utf8'));
  });
  assert.deepEqual(problems, [], 'possible credentials in tracked files');
});
