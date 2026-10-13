// SEO checks against a running production build (see tests/e2e/site.test.ts
// for how to start it):
//   BASE_URL=http://localhost:3100 npm run test:e2e
// The rendered HTML is what search engines and social networks read, so
// these tests inspect it directly rather than the TypeScript source.
// Against production (BASE_URL=https://www.vedascholars.com) the same checks
// run unchanged, except that X-Robots-Tag must then be absent.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium, type Browser } from 'playwright-core';
import { RETIRED_ROUTE_PREFIXES, SITE_URL, isRetiredPath } from '../../src/lib/site';
import { INDEXABLE_PAGES, fullTitle, type IndexablePath } from '../../src/lib/seo';

const BASE_URL = (process.env.BASE_URL || '').replace(/\/$/, '');
if (!BASE_URL) throw new Error('Set BASE_URL to a running production build, e.g. http://localhost:3100');
const IS_CANONICAL_HOST = new URL(BASE_URL).host === new URL(SITE_URL).host;

const PATHS = Object.keys(INDEXABLE_PAGES) as IndexablePath[];
const get = (path: string, init?: RequestInit) => fetch(`${BASE_URL}${path}`, { redirect: 'manual', ...init });

const decode = (s: string) =>
  s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const head = (html: string) => html.slice(0, html.indexOf('</head>'));
const all = (html: string, re: RegExp) => [...html.matchAll(re)].map((m) => decode(m[1]));
const meta = (html: string, attr: 'name' | 'property', key: string) =>
  all(head(html), new RegExp(`<meta ${attr}="${key.replace(/[:]/g, '\\:')}" content="([^"]*)"`, 'g'));
const jsonLdBlocks = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));

const pageCache = new Map<string, string>();
const html = async (path: string) => {
  if (!pageCache.has(path)) {
    const res = await get(path);
    assert.equal(res.status, 200, `${path} -> ${res.status}`);
    pageCache.set(path, await res.text());
  }
  return pageCache.get(path)!;
};

let browser: Browser | null = null;
let browserSkipReason = '';
before(async () => {
  for (const channel of ['chrome', 'msedge']) {
    try {
      browser = await chromium.launch({ channel, headless: true });
      return;
    } catch (error) {
      browserSkipReason = `no Chrome or Edge available (${(error as Error).message.split('\n')[0]})`;
    }
  }
});
after(async () => {
  await browser?.close();
});

// ---------------- Pages ----------------

test('every indexable page returns 200 HTML with one title, description and canonical', async () => {
  for (const path of PATHS) {
    const res = await get(path);
    assert.equal(res.status, 200, path);
    assert.match(res.headers.get('content-type') || '', /text\/html/, path);
    const page = await res.text();
    pageCache.set(path, page);
    const h = head(page);
    assert.deepEqual(all(h, /<title>([^<]*)<\/title>/g), [fullTitle(path)], `${path}: title`);
    assert.deepEqual(meta(page, 'name', 'description'), [INDEXABLE_PAGES[path].description], `${path}: description`);
    const canonical = all(h, /<link rel="canonical" href="([^"]*)"/g);
    assert.deepEqual(canonical, [path === '/' ? SITE_URL : `${SITE_URL}${path}`], `${path}: canonical`);
    assert.match(page, /<html lang="en"/, `${path}: language`);
    assert.equal((page.match(/<h1[\s>]/g) || []).length, 1, `${path}: exactly one h1`);
  }
});

test('no indexable page is accidentally noindex', async () => {
  for (const path of PATHS) {
    const res = await get(path);
    const page = await res.text();
    const robots = meta(page, 'name', 'robots');
    assert.deepEqual(robots, ['index, follow'], `${path}: robots meta`);
    assert.ok(!/noindex/.test(meta(page, 'name', 'googlebot').join()), `${path}: googlebot meta`);
    const header = res.headers.get('x-robots-tag');
    if (IS_CANONICAL_HOST) assert.equal(header, null, `${path}: X-Robots-Tag on the production host`);
    // Any other host (localhost, *.vercel.app, previews) must not be indexable.
    else assert.match(header || '', /noindex/, `${path}: non-canonical host is indexable`);
  }
});

test('Open Graph and X tags describe each page with an absolute 1200 x 630 image', async () => {
  for (const path of PATHS) {
    const page = await html(path);
    const url = path === '/' ? SITE_URL : `${SITE_URL}${path}`;
    const one = (attr: 'name' | 'property', key: string) => {
      const values = meta(page, attr, key);
      assert.equal(values.length, 1, `${path}: ${key} appears ${values.length} times`);
      return values[0];
    };
    assert.equal(one('property', 'og:url'), url);
    assert.equal(one('property', 'og:title'), fullTitle(path));
    assert.equal(one('property', 'og:description'), INDEXABLE_PAGES[path].description);
    assert.equal(one('property', 'og:type'), 'website');
    assert.equal(one('property', 'og:site_name'), 'Veda Scholars');
    assert.match(one('property', 'og:image'), /^https:\/\/www\.vedascholars\.com\/opengraph-image/);
    assert.equal(one('property', 'og:image:width'), '1200');
    assert.equal(one('property', 'og:image:height'), '630');
    assert.equal(one('property', 'og:image:type'), 'image/png');
    assert.ok(one('property', 'og:image:alt').length > 10);
    assert.equal(one('name', 'twitter:card'), 'summary_large_image');
    assert.equal(one('name', 'twitter:title'), fullTitle(path));
    assert.equal(one('name', 'twitter:description'), INDEXABLE_PAGES[path].description);
    assert.match(one('name', 'twitter:image'), /^https:\/\/www\.vedascholars\.com\/opengraph-image/);
  }
});

test('the social preview image is a reachable 1200 x 630 PNG', async () => {
  const urls = new Set<string>();
  for (const path of PATHS) {
    const page = await html(path);
    for (const key of ['og:image']) meta(page, 'property', key).forEach((u) => urls.add(u));
    meta(page, 'name', 'twitter:image').forEach((u) => urls.add(u));
  }
  for (const absolute of urls) {
    const { pathname, search } = new URL(absolute);
    const res = await get(`${pathname}${search}`);
    assert.equal(res.status, 200, absolute);
    assert.equal(res.headers.get('content-type'), 'image/png', absolute);
    const bytes = Buffer.from(await res.arrayBuffer());
    assert.equal(bytes.subarray(1, 4).toString(), 'PNG', absolute);
    assert.deepEqual([bytes.readUInt32BE(16), bytes.readUInt32BE(20)], [1200, 630], absolute);
    assert.ok(bytes.length < 300_000, `${absolute} is ${bytes.length} bytes (WhatsApp prefers < 300 KB)`);
  }
});

test('structured data parses and describes the organisation and each page', async () => {
  const home = jsonLdBlocks(await html('/')).flat();
  assert.deepEqual(home.map((d) => d['@type']).sort(), ['Organization', 'WebSite']);
  const org = home.find((d) => d['@type'] === 'Organization');
  assert.equal(org.url, SITE_URL);
  assert.equal((await get(new URL(org.logo).pathname)).status, 200, 'organisation logo');
  for (const path of PATHS.filter((p) => p !== '/')) {
    const blocks = jsonLdBlocks(await html(path));
    assert.equal(blocks.length, 1, `${path}: JSON-LD blocks`);
    const [crumbs] = blocks;
    assert.equal(crumbs['@type'], 'BreadcrumbList');
    assert.equal(crumbs.itemListElement.at(-1).item, `${SITE_URL}${path}`);
  }
});

// ---------------- Sitemap and robots ----------------

test('sitemap.xml is valid XML listing only indexable canonical pages', async () => {
  const res = await get('/sitemap.xml');
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type') || '', /xml/);
  const xml = (await res.text()).trim();
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>\s*<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">[\s\S]*<\/urlset>$/);
  // Well-formed: every <url> has exactly one <loc> and <lastmod>, nothing else.
  const body = xml.replace(/^<\?xml[^>]*\?>\s*<urlset[^>]*>/, '').replace(/<\/urlset>$/, '');
  const entries = [...body.matchAll(/\s*<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<\/url>/g)];
  assert.equal(entries.map((m) => m[0]).join(''), body.replace(/\s+$/, ''), 'unexpected sitemap content');
  const locs = entries.map((m) => m[1]);
  assert.equal(new Set(locs).size, locs.length, 'duplicate URLs');
  assert.deepEqual(locs, PATHS.map((p) => (p === '/' ? SITE_URL : `${SITE_URL}${p}`)));
  for (const [, loc, lastmod] of entries) {
    assert.match(lastmod, /^\d{4}-\d{2}-\d{2}$/, `${loc}: lastmod`);
    const path = new URL(loc).pathname;
    assert.ok(!isRetiredPath(path), `${loc} is retired`);
    // Every listed URL is reachable and canonical to itself.
    const page = await html(path);
    assert.deepEqual(all(head(page), /<link rel="canonical" href="([^"]*)"/g), [loc]);
  }
});

test('robots.txt allows crawling, references the canonical sitemap and does not hide 410s', async () => {
  const res = await get('/robots.txt');
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type') || '', /text\/plain/);
  const robots = await res.text();
  assert.match(robots, /^User-Agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.ok(!/^Disallow: \/$/m.test(robots), 'whole site disallowed');
  assert.match(robots, /^Sitemap: https:\/\/www\.vedascholars\.com\/sitemap\.xml$/m);
  for (const line of robots.match(/^Disallow: .*$/gm) || []) {
    assert.equal(line, 'Disallow: /api/');
  }
});

// ---------------- Non-indexable routes ----------------

test('retired routes answer 410 noindex and never canonicalise to a public page', async () => {
  for (const path of [...RETIRED_ROUTE_PREFIXES, '/auth/callback?code=x', '/jobs/apply', '/dashboard/student']) {
    const res = await get(path);
    assert.equal(res.status, 410, path);
    assert.match(res.headers.get('x-robots-tag') || '', /noindex/, path);
    const page = await res.text();
    assert.match(meta(page, 'name', 'robots').join(), /noindex/, path);
    assert.ok(!/<link rel="canonical"/.test(head(page)), `${path}: canonical on a retired page`);
    assert.ok(!meta(page, 'property', 'og:url').length, `${path}: og:url on a retired page`);
  }
});

test('utility pages are noindex and unknown URLs are a real 404', async () => {
  for (const path of ['/thank-you', '/no-longer-available']) {
    const page = await html(path);
    assert.match(meta(page, 'name', 'robots').join(), /noindex/, path);
    assert.ok(!/<link rel="canonical"/.test(head(page)), path);
  }
  const missing = await get('/this-page-does-not-exist');
  assert.equal(missing.status, 404);
  const page = await missing.text();
  assert.match(meta(page, 'name', 'robots').join(), /noindex/);
  assert.equal((head(page).match(/<title>/g) || []).length, 1, 'one title on the 404 page');
});

test('legacy aliases are single-hop permanent redirects to indexable pages', async () => {
  const aliases: Record<string, string> = {
    '/counselling': '/contact?type=student',
    '/book-counselling': '/contact?type=student',
    '/get-started': '/contact?type=student',
    '/partner': '/contact?type=partner',
  };
  for (const [from, to] of Object.entries(aliases)) {
    const res = await get(from);
    assert.equal(res.status, 308, from);
    const location = new URL(res.headers.get('location')!, BASE_URL);
    assert.equal(`${location.pathname}${location.search}`, to, from);
    assert.equal((await get(to)).status, 200, `${from} -> ${to} is not a final page`);
  }
});

// ---------------- Browser ----------------

test('pages hydrate without console errors at mobile and desktop widths', async (t) => {
  if (!browser) return t.skip(browserSkipReason);
  const problems: string[] = [];
  for (const viewport of [{ width: 390, height: 844 }, { width: 1366, height: 900 }]) {
    const context = await browser.newContext({ viewport });
    try {
      for (const path of PATHS) {
        const page = await context.newPage();
        page.on('console', (msg) => {
          if (msg.type() === 'error') problems.push(`${viewport.width}px ${path}: ${msg.text()}`);
        });
        page.on('pageerror', (error) => problems.push(`${viewport.width}px ${path}: ${error.message}`));
        await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle' });
        const visibleH1 = await page.locator('h1').first().isVisible();
        if (!visibleH1) await page.waitForTimeout(3000); // the home intro curtain
        assert.ok(await page.locator('h1').first().isVisible(), `${viewport.width}px ${path}: h1 not visible`);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        assert.ok(overflow <= 0, `${viewport.width}px ${path}: horizontal overflow ${overflow}px`);
        await page.close();
      }
    } finally {
      await context.close();
    }
  }
  assert.deepEqual(problems, [], 'console errors or hydration mismatches');
});
