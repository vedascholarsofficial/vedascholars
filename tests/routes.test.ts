// Static checks for the public route map: retired routes, navigation and
// internal links. Runtime behaviour is covered by tests/e2e/site.test.ts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { NextRequest } from 'next/server';
import { proxy, config as proxyConfig } from '../src/proxy';
import { HEADER_CTA, PRIMARY_NAV, RETIRED_ROUTE_PREFIXES, isRetiredPath } from '../src/lib/site';
import sitemap from '../src/app/sitemap';
import robots from '../src/app/robots';

const ROOT = join(__dirname, '..');
const APP_DIR = join(ROOT, 'src', 'app');

const hasPage = (path: string) => existsSync(join(APP_DIR, ...path.split('/').filter(Boolean), 'page.tsx'));

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : /\.(tsx?|jsx?)$/.test(name) ? [full] : [];
  });

// Source that is still served publicly: everything except the retired route
// folders and components used only by them.
const publicSourceFiles = () =>
  walk(join(ROOT, 'src')).filter((file) => {
    const rel = relative(ROOT, file).replace(/\\/g, '/');
    if (rel.startsWith('src/app/')) {
      const route = `/${rel.slice('src/app/'.length).split('/')[0]}`;
      return !isRetiredPath(route);
    }
    // site.ts and proxy.ts define the retired routes; services call the API.
    return (
      !rel.startsWith('src/components/jobs/') &&
      !rel.startsWith('src/services/') &&
      rel !== 'src/lib/site.ts' &&
      rel !== 'src/proxy.ts'
    );
  });

// Internal links written as href="/x", href: '/x', href={'/x'}, push('/x').
const internalLinks = (source: string) =>
  [...source.matchAll(/(?:href\s*[=:]\s*\{?\s*|push\()\s*['"`](\/[^'"`?#\s]*)/g)].map((m) => m[1]);

test('retired routes cover accounts, Google sign-in callback, job applications and the portal', () => {
  for (const path of [
    '/login',
    '/register',
    '/auth',
    '/auth/callback',
    '/forgot-password',
    '/reset-password/abc123',
    '/jobs',
    '/jobs/apply',
    '/jobs/123',
    '/jobs/create',
    '/dashboard',
    '/dashboard/admin',
    '/profile',
    '/settings',
    '/resume',
    '/applications',
    '/vedabot',
    '/admin/jobs',
    '/universities',
  ]) {
    assert.ok(isRetiredPath(path), `${path} should be retired`);
  }
  for (const path of ['/', '/contact', '/about', '/student-journey', '/for-parents', '/services', '/logins', '/jobsite', '/careers']) {
    assert.ok(!isRetiredPath(path), `${path} should stay public`);
  }
});

test('the proxy matcher lists exactly the retired route prefixes', () => {
  const expected = RETIRED_ROUTE_PREFIXES.map((prefix) => `${prefix}/:path*`).sort();
  assert.deepEqual([...proxyConfig.matcher].sort(), expected);
});

test('the proxy answers retired routes with 410 and leaves other routes alone', () => {
  for (const path of ['/login', '/register', '/auth/callback', '/jobs/apply', '/dashboard/student']) {
    const res = proxy(new NextRequest(`https://www.vedascholars.com${path}?code=x`));
    assert.equal(res.status, 410, path);
    assert.match(res.headers.get('x-middleware-rewrite') ?? '', /\/no-longer-available/, path);
    assert.equal(res.headers.get('x-robots-tag'), 'noindex');
  }
  const passThrough = proxy(new NextRequest('https://www.vedascholars.com/contact'));
  assert.equal(passThrough.status, 200);
  assert.equal(passThrough.headers.get('x-middleware-rewrite'), null);
});

test('header navigation matches the approved order, with Contact Us only as the button', () => {
  assert.deepEqual(
    PRIMARY_NAV.map((link) => [link.name, link.href]),
    [
      ['Home', '/'],
      ['About Us', '/about'],
      ['Student Journey', '/student-journey'],
      ['Services', '/services'],
      ['Programs', '/programs'],
      ['For Parents', '/for-parents'],
    ]
  );
  assert.deepEqual({ ...HEADER_CTA }, { name: 'Contact Us', href: '/contact' });
  assert.ok(!PRIMARY_NAV.some((link) => link.href.startsWith('/contact')), 'no second Contact link');
});

test('every navigation target and sitemap entry has a page and is public', () => {
  const sitemapPaths = sitemap().map((entry) => new URL(entry.url).pathname.replace(/\/$/, '') || '/');
  for (const path of [...PRIMARY_NAV.map((l) => l.href), HEADER_CTA.href, ...sitemapPaths]) {
    assert.ok(hasPage(path), `${path} has no page`);
    assert.ok(!isRetiredPath(path), `${path} is retired`);
  }
  for (const path of ['/student-journey', '/programs', '/for-parents', '/contact']) {
    assert.ok(sitemapPaths.includes(path), `${path} missing from the sitemap`);
  }
});

test('robots.txt does not hide retired routes from crawlers (they must see the 410)', () => {
  const rules = robots().rules;
  const disallow = (Array.isArray(rules) ? rules : [rules]).flatMap((rule) => rule.disallow ?? []);
  for (const path of disallow) {
    assert.ok(!isRetiredPath(path.replace(/\/$/, '')), `${path} is disallowed`);
  }
});

test('public pages and components link only to existing, public pages', () => {
  const problems: string[] = [];
  let checked = 0;
  for (const file of publicSourceFiles()) {
    for (const link of internalLinks(readFileSync(file, 'utf8'))) {
      checked++;
      const path = link.replace(/\/$/, '') || '/';
      if (path.startsWith('/api/') || path.startsWith('/images/') || path.startsWith('/_next/')) continue;
      if (isRetiredPath(path)) problems.push(`${relative(ROOT, file)} links to retired ${path}`);
      else if (!hasPage(path)) problems.push(`${relative(ROOT, file)} links to missing ${path}`);
    }
  }
  assert.ok(checked > 40, `only ${checked} links found; the link pattern may be broken`);
  assert.deepEqual(problems, []);
});

test('public source has no sign-in, sign-up, Get Started or Apply for Jobs entry points', () => {
  const banned = /\b(log ?in|sign ?in|sign ?up|create (?:a |your |free )?account|get started|apply for jobs)\b/i;
  const problems: string[] = [];
  for (const file of publicSourceFiles()) {
    if (file.includes(`${join('src', 'context')}`)) continue; // AuthProvider is kept for the retired pages
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, index) => {
        if (banned.test(line) && !/^\s*(\/\/|\*|\{\/\*)/.test(line)) {
          problems.push(`${relative(ROOT, file)}:${index + 1}: ${line.trim()}`);
        }
      });
  }
  assert.deepEqual(problems, []);
});

test('the header has no account, sign-in or notification features', () => {
  const header = readFileSync(join(ROOT, 'src', 'components', 'layout', 'Header.tsx'), 'utf8');
  assert.ok(!/useAuth|notificationService|logout|\/dashboard|\/profile/.test(header));
});

test('every sitemap page declares its own canonical URL', () => {
  for (const entry of sitemap()) {
    const path = new URL(entry.url).pathname.replace(/\/$/, '') || '/';
    const dir = join(APP_DIR, ...path.split('/').filter(Boolean));
    const sources = ['page.tsx', 'layout.tsx']
      .map((name) => join(dir, name))
      .filter((file) => existsSync(file))
      .map((file) => readFileSync(file, 'utf8'))
      .join('\n');
    assert.ok(sources.includes(`canonical: '${path}'`), `${path} has no canonical`);
  }
});
