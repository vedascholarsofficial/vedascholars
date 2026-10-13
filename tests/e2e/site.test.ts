// Runtime checks against a running production build:
//   npm run build && npx next start -p 3100
//   BASE_URL=http://localhost:3100 npm run test:e2e
// By default the server is expected to run WITHOUT lead-pipeline environment
// variables: the contact tests then expect the API to refuse submissions (503)
// and stub it in the browser for the success path, so no enquiry is sent.
// Against a configured staging server set E2E_LEADS_CONFIGURED=1; the tests
// then only send invalid enquiries, which are rejected before storage.
// Browser tests use an installed Chrome or Edge via playwright-core and are
// skipped when neither is available.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium, type Browser, type Page } from 'playwright-core';
import { HEADER_CTA, PRIMARY_NAV, RETIRED_ROUTE_PREFIXES, isRetiredPath } from '../../src/lib/site';

const BASE_URL = (process.env.BASE_URL || '').replace(/\/$/, '');
const LEADS_CONFIGURED = process.env.E2E_LEADS_CONFIGURED === '1';
if (!BASE_URL) throw new Error('Set BASE_URL to a running production build, e.g. http://localhost:3100');

const get = (path: string, init?: RequestInit) => fetch(`${BASE_URL}${path}`, { redirect: 'manual', ...init });

const hrefs = (html: string) =>
  [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));

// Extracts the element that starts at the first match of `startPattern`.
const elementHtml = (html: string, startPattern: RegExp, tag: string) => {
  const start = html.search(startPattern);
  assert.ok(start >= 0, `element ${startPattern} not found`);
  const end = html.indexOf(`</${tag}>`, start);
  return html.slice(start, end);
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

const withPage = async (viewport: { width: number; height: number }, run: (page: Page) => Promise<void>) => {
  const context = await browser!.newContext({ viewport });
  try {
    await run(await context.newPage());
  } finally {
    await context.close();
  }
};

// ---------------- Retired routes ----------------

test('retired account, job and portal routes answer 410 with a way forward', async () => {
  const paths = [
    ...RETIRED_ROUTE_PREFIXES,
    '/auth/callback?code=abc',
    '/reset-password/0123456789abcdef',
    '/jobs/apply',
    '/jobs/123',
    '/dashboard/student',
    '/admin/jobs',
  ];
  for (const path of paths) {
    const res = await get(path);
    assert.equal(res.status, 410, path);
    assert.equal(res.headers.get('x-robots-tag'), 'noindex', path);
    assert.ok(res.headers.get('content-security-policy'), `${path}: security headers missing`);
    assert.equal(res.headers.get('x-frame-options'), 'DENY', path);
    const html = await res.text();
    assert.match(html, /This page is no longer available/, path);
    assert.ok(hrefs(html).includes('/contact'), `${path}: no Contact Us link`);
    assert.ok(!/name="password"|type="password"/.test(html), `${path}: renders a sign-in form`);
  }
});

test('look-alike paths are not caught by the retirement rules', async () => {
  assert.equal((await get('/logins')).status, 404);
  assert.equal((await get('/jobsite')).status, 404);
});

// ---------------- Header and pages ----------------

test('header shows the approved links in order and Contact Us as the only contact entry', async () => {
  for (const path of ['/', '/about', '/student-journey', '/for-parents', '/contact']) {
    const html = await (await get(path)).text();
    const desktopNav = elementHtml(html, /<nav aria-label="Main"/, 'nav');
    assert.deepEqual(hrefs(desktopNav), PRIMARY_NAV.map((l) => l.href), path);
    const mobileNav = elementHtml(html, /<nav aria-label="Mobile"/, 'nav');
    assert.deepEqual(hrefs(mobileNav), [...PRIMARY_NAV.map((l) => l.href), HEADER_CTA.href], path);

    const cta = html.match(/<a[^>]*id="btn-nav-cta"[^>]*>([^<]*)<\/a>/);
    assert.ok(cta, `${path}: header CTA missing`);
    assert.match(cta[0], /href="\/contact"/);
    assert.equal(cta[1], 'Contact Us');

    const header = elementHtml(html, /<header\b/, 'header');
    assert.ok(!/Get Started|Log ?in|Sign ?in|Sign ?up|Apply for Jobs|Book a Consultation/i.test(header), `${path}: old header entry`);
  }
});

test('the current page is marked with aria-current in the header', async () => {
  const html = await (await get('/for-parents')).text();
  const desktopNav = elementHtml(html, /<nav aria-label="Main"/, 'nav');
  assert.match(desktopNav, /<a[^>]*aria-current="page"[^>]*href="\/for-parents"|<a[^>]*href="\/for-parents"[^>]*aria-current="page"/);
  assert.equal((desktopNav.match(/aria-current="page"/g) || []).length, 1);
});

test('mobile menu is an accessible, closed disclosure on first render', async () => {
  const html = await (await get('/')).text();
  const toggle = html.match(/<button[^>]*aria-controls="mobile-menu"[^>]*>/);
  assert.ok(toggle, 'menu toggle missing');
  assert.match(toggle[0], /aria-expanded="false"/);
  assert.match(toggle[0], /aria-label="Open menu"/);
  assert.match(toggle[0], /type="button"/);
  assert.match(html, /<div[^>]*id="mobile-menu"[^>]*inert=""|<div[^>]*inert=""[^>]*id="mobile-menu"/);
});

test('Student Journey and For Parents pages render their content', async () => {
  const journey = await get('/student-journey');
  assert.equal(journey.status, 200);
  const journeyHtml = (await journey.text()).replace(/<!-- -->/g, '');
  for (const [index, stage] of ['Discover', 'Choose', 'Apply', 'Settle', 'Connect', 'Advance'].entries()) {
    assert.match(journeyHtml, new RegExp(`Stage 0${index + 1}: </span>${stage} <span`), `stage ${stage}`);
  }
  assert.match(journeyHtml, /<title>Our Student Journey \| Veda Scholars<\/title>/);
  assert.ok(hrefs(journeyHtml).includes('/contact?type=student'));

  const parents = await get('/for-parents');
  assert.equal(parents.status, 200);
  const parentsHtml = await parents.text();
  assert.match(parentsHtml, /<h1[^>]*>Supporting your family(&#x27;|&apos;|')s decision<\/h1>/);
  assert.match(parentsHtml, /Privacy and support boundaries/);
  assert.match(parentsHtml, /<title>For Parents \| Veda Scholars<\/title>/);
});

test('no internal link on any public page is broken or points to a retired route', async () => {
  const sitemap = await (await get('/sitemap.xml')).text();
  const queue = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  assert.ok(queue.includes('/student-journey') && queue.includes('/for-parents'));
  const seen = new Set<string>();
  const problems: string[] = [];

  while (queue.length > 0 && seen.size < 80) {
    const path = queue.shift()!;
    if (seen.has(path)) continue;
    seen.add(path);

    let res = await get(path);
    // Legacy URLs (e.g. /counselling) redirect once to a public page.
    if (res.status >= 300 && res.status < 400) {
      const target = new URL(res.headers.get('location')!, BASE_URL);
      if (isRetiredPath(target.pathname)) problems.push(`${path} redirects to retired ${target.pathname}`);
      res = await get(`${target.pathname}${target.search}`);
    }
    if (res.status !== 200) {
      problems.push(`${path} -> ${res.status}`);
      continue;
    }
    if (!(res.headers.get('content-type') || '').includes('text/html')) continue;

    for (const href of hrefs(await res.text())) {
      if (!href.startsWith('/') || href.startsWith('//')) continue;
      const target = new URL(href, BASE_URL).pathname;
      if (target.startsWith('/_next/') || target.startsWith('/images/')) continue;
      if (isRetiredPath(target)) problems.push(`${path} links to retired ${target}`);
      else if (!seen.has(target)) queue.push(target);
    }
  }
  assert.ok(seen.size >= 12, `only crawled ${seen.size} pages`);
  assert.deepEqual(problems, []);
});

test('sitemap, robots and canonical tags all use the canonical host', async () => {
  const sitemap = await (await get('/sitemap.xml')).text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.ok(urls.length >= 12);
  for (const url of urls) {
    assert.ok(url.startsWith('https://www.vedascholars.com'), url);
    const path = new URL(url).pathname;
    const html = await (await get(path)).text();
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
    assert.ok(canonical, `${path}: no canonical tag`);
    assert.equal(canonical[1].replace(/\/$/, ''), url.replace(/\/$/, ''), path);
    assert.ok(!/<meta name="robots" content="noindex/.test(html), `${path} is noindex`);
  }
  const robots = await (await get('/robots.txt')).text();
  assert.match(robots, /Sitemap: https:\/\/www\.vedascholars\.com\/sitemap\.xml/);
  assert.ok(!/Disallow: \/(login|jobs)/.test(robots));
});

test('legacy consultation URLs still reach the contact page', async () => {
  for (const path of ['/counselling', '/book-counselling', '/get-started']) {
    const res = await get(path);
    assert.ok([307, 308].includes(res.status), `${path} -> ${res.status}`);
    assert.match(res.headers.get('location') || '', /\/contact\?type=student$/);
  }
});

// ---------------- Lead API ----------------

test('contact page and lead API work without any sign-in', async () => {
  const page = await get('/contact');
  assert.equal(page.status, 200);
  assert.equal(page.headers.get('set-cookie'), null);
  const res = await get('/api/leads', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: BASE_URL },
    body: JSON.stringify({ name: 'Test Person', email: 'test@example.test' }),
  });
  const body = await res.json();
  assert.equal(body.ok, false);
  if (LEADS_CONFIGURED) {
    // Incomplete enquiry: rejected by validation, nothing stored.
    assert.equal(res.status, 400);
    assert.ok(body.fieldErrors.phone && body.fieldErrors.consent);
  } else {
    // Unconfigured server: the API refuses rather than faking success.
    assert.equal(res.status, 503);
    assert.match(body.message, /WhatsApp/);
  }
});

// ---------------- Browser: mobile menu, alignment, contact form ----------------

test('mobile menu: opens, traps focus, closes on Escape and returns focus', async (t) => {
  if (!browser) return t.skip(browserSkipReason);
  await withPage({ width: 390, height: 844 }, async (page) => {
    await page.goto(`${BASE_URL}/about`);
    const toggle = page.locator('button[aria-controls="mobile-menu"]');
    const menu = page.locator('#mobile-menu');
    assert.equal(await page.locator('nav[aria-label="Main"]').isVisible(), false, 'desktop nav hidden on mobile');

    await toggle.click();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    assert.equal(await toggle.getAttribute('aria-label'), 'Close menu');
    assert.equal(await menu.evaluate((el) => el.hasAttribute('inert')), false);
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('href')), '/', 'focus moves to the first link');
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden', 'page scroll locked');

    // Tab through every item and wrap around without leaving the menu.
    const visited: string[] = [];
    for (let i = 0; i < 9; i++) {
      await page.keyboard.press('Tab');
      visited.push(
        await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          return el.closest('#mobile-menu') ? el.getAttribute('href') || '' : el.getAttribute('aria-controls') === 'mobile-menu' ? 'toggle' : `OUTSIDE:${el.tagName}`;
        })
      );
    }
    assert.ok(!visited.some((v) => v.startsWith('OUTSIDE')), `focus escaped the menu: ${visited.join(', ')}`);
    assert.ok(visited.includes('toggle') && visited.includes('/contact'), visited.join(', '));

    await page.keyboard.press('Shift+Tab');
    assert.ok(await page.evaluate(() => !!document.activeElement?.closest('header, #mobile-menu')));

    await page.keyboard.press('Escape');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    assert.equal(await menu.evaluate((el) => el.hasAttribute('inert')), true);
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-controls')), 'mobile-menu', 'focus returns to toggle');
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
  });
});

test('mobile menu: links navigate and close the menu; touch targets are large enough', async (t) => {
  if (!browser) return t.skip(browserSkipReason);
  await withPage({ width: 360, height: 740 }, async (page) => {
    await page.goto(`${BASE_URL}/`);
    await page.locator('button[aria-controls="mobile-menu"]').click();
    for (const link of await page.locator('#mobile-menu a').all()) {
      const box = await link.boundingBox();
      assert.ok(box && box.height >= 44, `touch target too small: ${await link.textContent()}`);
    }
    await page.locator('#mobile-menu a[href="/for-parents"]').click();
    await page.waitForURL(`${BASE_URL}/for-parents`);
    assert.equal(await page.locator('button[aria-controls="mobile-menu"]').getAttribute('aria-expanded'), 'false');
    assert.equal(await page.locator('#mobile-menu').evaluate((el) => el.hasAttribute('inert')), true);
  });
});

test('mobile services: titles expand, one service stays open, and close returns focus', async (t) => {
  if (!browser) return t.skip(browserSkipReason);
  await withPage({ width: 390, height: 844 }, async (page) => {
    await page.goto(`${BASE_URL}/services`);
    const cards = page.locator('#discover-decide article details');
    const first = cards.nth(0);
    const second = cards.nth(1);
    assert.equal(await first.evaluate((el) => (el as HTMLDetailsElement).open), false);
    await first.locator('summary').click();
    assert.equal(await first.evaluate((el) => (el as HTMLDetailsElement).open), true);
    assert.ok(await first.locator('p').isVisible());
    await second.locator('summary').click();
    assert.equal(await first.evaluate((el) => (el as HTMLDetailsElement).open), false);
    await second.getByRole('button', { name: 'Close University Discovery & Comparison', exact: true }).click();
    assert.equal(await second.evaluate((el) => (el as HTMLDetailsElement).open), false);
    assert.ok(await second.locator('summary').evaluate((el) => el === document.activeElement));
  });
});

test('mobile services: vertical scrolling reaches every pillar without navigation controls', async (t) => {
  if (!browser) return t.skip(browserSkipReason);
  await withPage({ width: 360, height: 800 }, async (page) => {
    await page.goto(`${BASE_URL}/services#access-affordability`);
    assert.equal(await page.getByRole('button', { name: 'Next pillar', exact: true }).count(), 0);
    const content = page.locator('[aria-label="Service pillar content"]');
    assert.ok(!(await content.innerText()).includes('Pillar 1 of 5'));
    for (const id of ['discover-decide', 'access-affordability', 'prepare-settle', 'learn-connect-grow', 'career-beyond']) {
      const section = page.locator(`#${id}`);
      await section.locator('h2').scrollIntoViewIfNeeded();
      assert.ok(await section.locator('h2').isVisible());
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    }
    assert.equal(await content.locator('[inert]').count(), 0);
    await page.setViewportSize({ width: 1280, height: 900 });
    assert.equal(await page.locator('article > div:visible').count(), 28);
  });
});

test('no horizontal scrolling at 360, 768 and 1280 px', async (t) => {
  if (!browser) return t.skip(browserSkipReason);
  for (const width of [360, 768, 1280]) {
    await withPage({ width, height: 800 }, async (page) => {
      for (const path of ['/', '/student-journey', '/for-parents', '/contact', '/login']) {
        await page.goto(`${BASE_URL}${path}`);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        assert.ok(overflow <= 0, `${path} at ${width}px overflows by ${overflow}px`);
      }
    });
  }
});

test('desktop header: links and Contact Us button share one vertical centre line', async (t) => {
  if (!browser) return t.skip(browserSkipReason);
  for (const width of [1024, 1280, 1536]) {
    await withPage({ width, height: 800 }, async (page) => {
      await page.goto(`${BASE_URL}/about`);
      assert.equal(await page.locator('button[aria-controls="mobile-menu"]').isVisible(), false, `toggle visible at ${width}`);
      const boxes = await Promise.all(
        [
          page.locator('header a[aria-label="Veda Scholars home"]'),
          ...(await page.locator('nav[aria-label="Main"] a').all()),
          page.locator('#btn-nav-cta'),
        ].map((l) => l.boundingBox())
      );
      const centres = boxes.map((b) => b!.y + b!.height / 2);
      const spread = Math.max(...centres) - Math.min(...centres);
      assert.ok(spread <= 2, `vertical misalignment of ${spread}px at ${width}px`);
      // Nothing wraps or overlaps: items run left to right.
      for (let i = 1; i < boxes.length; i++) {
        assert.ok(boxes[i]!.x >= boxes[i - 1]!.x + boxes[i - 1]!.width, `overlap at ${width}px`);
      }
      const cta = await page.locator('#btn-nav-cta').textContent();
      assert.equal(cta, 'Contact Us');
    });
  }
});

const fillContactForm = async (page: Page) => {
  await page.goto(`${BASE_URL}/contact?type=student`);
  await page.getByLabel('Full Name').fill('Test Person');
  await page.getByLabel('Email Address').fill('test.person@example.test');
  await page.getByLabel('Phone Number').fill('+44 20 7946 0000');
  assert.equal(await page.getByLabel('Purpose of Inquiry').inputValue(), 'Student Counselling');
  await page.locator('#contact-consent').check();
};

test('contact form shows an error, never success, when the server refuses the enquiry', async (t) => {
  if (!browser) return t.skip(browserSkipReason);
  if (LEADS_CONFIGURED) return t.skip('configured server would accept a real enquiry');
  await withPage({ width: 390, height: 844 }, async (page) => {
    await fillContactForm(page);
    await page.locator('#form-consultation-submit').click();
    const alert = page.locator('[role="alert"] p');
    await alert.waitFor();
    assert.match((await alert.textContent()) || '', /could not submit/i);
    assert.equal(await page.getByText('Thank You!').count(), 0);
  });
});

test('contact form shows field errors and handles network failure', async (t) => {
  if (!browser) return t.skip(browserSkipReason);
  await withPage({ width: 1280, height: 900 }, async (page) => {
    await page.route('**/api/leads', (route) =>
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ ok: false, message: 'Please check the highlighted fields.', fieldErrors: { email: 'Please enter a valid email address.' } }),
      })
    );
    await fillContactForm(page);
    await page.locator('#form-consultation-submit').click();
    await page.locator('#contact-email-error').waitFor();
    assert.equal(await page.getByLabel('Email Address').getAttribute('aria-invalid'), 'true');

    await page.unroute('**/api/leads');
    await page.route('**/api/leads', (route) => route.abort('failed'));
    await page.locator('#form-consultation-submit').click();
    await page.getByText(/could not reach our server/i).waitFor();
    assert.equal(await page.getByText('Thank You!').count(), 0);
  });
});

test('contact form shows success and the reference only after the server accepts', async (t) => {
  if (!browser) return t.skip(browserSkipReason);
  await withPage({ width: 1280, height: 900 }, async (page) => {
    const captured: { body?: Record<string, unknown> } = {};
    await page.route('**/api/leads', async (route) => {
      captured.body = route.request().postDataJSON();
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ ok: true, reference: 'AB12CD34' }) });
    });
    await fillContactForm(page);
    await page.locator('#form-consultation-submit').click();
    await page.getByText('Thank You!').waitFor();
    await page.getByText('AB12CD34').waitFor();
    assert.ok(captured.body);
    assert.equal(captured.body.consent, true);
    assert.equal(captured.body.interest, 'Student Counselling');
    assert.equal(captured.body.company_website, '');
  });
});
