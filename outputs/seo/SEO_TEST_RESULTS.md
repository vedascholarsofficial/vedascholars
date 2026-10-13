# SEO Test Results: Veda Scholars

Run on 13 October 2026, Windows 11, Node 22.23.3, Next.js 16.4.0, headless Chrome via `playwright-core` 1.63.0. Every result below is from an actual run. Nothing was skipped.

## Environment for runtime tests

- `rm -rf .next && npx next build`, then `npx next start -p 3100`.
- The server was started with `RESEND_API_KEY`, `LEADS_MAIL_FROM`, `LEADS_NOTIFY_TO`, `SMTP_*` and `LEADS_MONGODB_URI` set to empty. Before the browser tests ran, `POST /api/leads` was confirmed to return **503**, so no real enquiry or email could be sent.
- Runtime tests ran on `http://localhost:3100`. On this non-canonical host the server correctly sends `X-Robots-Tag: noindex, nofollow`; the tests check that header and, when pointed at `https://www.vedascholars.com`, require it to be absent.

## Summary

| Suite | Command | Result |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | **Pass** |
| ESLint | `npm run lint` | 266 errors / 57 warnings, **identical to baseline**. No new findings; new files are lint-clean. |
| Production build | `npx next build` | **Pass**, no warnings (46 routes) |
| Unit and integration (frontend) | `npm test` | **46 / 46 pass** (34 existing + 12 new SEO) |
| API (Express) | `cd server && npm test` | **55 / 55 pass** (unchanged code; regression check) |
| Runtime and browser (E2E) | `BASE_URL=http://localhost:3100 npm run test:e2e` | **30 / 30 pass** (19 existing + 11 new SEO), 48.6 s |

## Coverage of the required checks

| # | Requirement | Test(s) | Result |
|---|---|---|---|
| 1 | Every indexable page returns 200 | e2e `every indexable page returns 200 HTML…` | Pass |
| 2 | Retired routes return intended status | e2e `retired routes answer 410 noindex…`, `retired account, job and portal routes answer 410…`, `look-alike paths…` (404); unit proxy tests | Pass |
| 3 | Sitemap is valid XML | e2e `sitemap.xml is valid XML…` (declaration, namespace, only `<url><loc><lastmod>` entries) | Pass |
| 4 | Sitemap has only indexable canonical URLs | e2e (each `<loc>` fetched, 200, self-canonical); unit `sitemap lists exactly the indexable pages…` | Pass |
| 5 | robots.txt reachable and correct | e2e `robots.txt allows crawling…`; unit `robots.txt … blocks previews` | Pass |
| 6 | Canonicals absolute and correct | e2e tests 1 and 6; existing `sitemap, robots and canonical tags…` | Pass |
| 7 | Open Graph valid | e2e `Open Graph and X tags describe each page…` (url, title, description, type, site_name, image + width/height/type/alt, each exactly once) | Pass |
| 8 | X (Twitter) metadata valid | same test (card, title, description, image) | Pass |
| 9 | Social images return 200 | e2e `the social preview image is a reachable 1200 x 630 PNG` (PNG signature, 1200 × 630, < 300 KB) | Pass |
| 10 | No duplicate title, canonical or description | e2e test 1 (exactly one each); 404 single-title check; unit uniqueness across pages | Pass |
| 11 | No accidental production noindex | e2e `no indexable page is accidentally noindex`; unit `root layout is indexable by default…` | Pass |
| 12 | No private or retired URLs in sitemap | unit and e2e sitemap tests; unit `every route is classified…` | Pass |
| 13 | Structured data parses | e2e `structured data parses…`; unit `structured data uses only published business facts…` | Pass |
| 14 | Main navigation links work | existing e2e header and crawl tests (crawl found no broken or retired links) | Pass |
| 15 | Contact page renders | existing e2e `contact page and lead API work without any sign-in` | Pass |
| 16 | Enquiry form behaviour preserved | existing e2e: server refusal shows error; field errors and network failure; success only after server acceptance; payload (consent, interest, honeypot) unchanged | Pass |
| 17 | Mobile and desktop layouts | existing e2e menu, alignment and overflow tests at 360/768/1280/1024/1536 px; new test at 390 and 1366 px on all 14 indexable pages | Pass (after fixing 2 pre-existing overflows) |
| 18 | No browser console errors | e2e `pages hydrate without console errors…` (console `error` + `pageerror`, 14 pages × 2 viewports) | Pass, 0 errors |
| 19 | No hydration errors | same test (React reports hydration mismatches as console errors) | Pass |
| 20 | No newly exposed credentials | unit `no credentials or environment files are tracked by git`; manual scan of `.next` client and prerender output against 17 local secret values (0 matches) | Pass |

## Defects found by the new tests during the run

1. **First e2e run:** the browser test failed with `390px /students: horizontal overflow 14px`. This was confirmed on the live site, so it was pre-existing. Fixed with `overflow-x-clip` on the scholarship section.
2. **Second run:** the same failure on `/partner-with-us` (`UniversitiesContent`), also confirmed live. Fixed the same way.
3. **During implementation:** the rendered-HTML audit showed subpages had **no** `og:image` once each page defined its own `openGraph`. Fixed by referencing the image explicitly. The test now guards against regressions.
4. **During implementation:** the audit found a duplicated brand in "Careers at Veda Scholars | Veda Scholars". Fixed; the unit test now requires the brand exactly once per title.

## Other verification

- Rendered-HTML audit of 40 routes before and after (status, location, X-Robots-Tag, title count, description, canonical count, robots meta, og:url/title/image, X card, H1 count, JSON-LD). Results are summarised in `ROUTE_INDEXABILITY_MATRIX.md`.
- Images: every `<img>` on the 12 main public pages has an `alt` attribute. The only empty `alt` is the decorative intro curtain.
- Lab Core Web Vitals: see `SEO_BASELINE_AUDIT.md` section 6. CLS about 0 everywhere; home LCP is the open item.
- DNS: see `SEARCH_CONSOLE_SETUP.md`.

## Not tested, and why

| Item | Reason |
|---|---|
| Google Rich Results Test / Schema Markup Validator | Needs a publicly reachable URL; run after deployment (release checklist step 6) |
| Real social previews (LinkedIn Post Inspector, Facebook Sharing Debugger, X, WhatsApp) | These fetch from the public internet; tags and image were validated locally against each platform's requirements (absolute HTTPS URL, 1200 × 630, PNG, < 300 KB) |
| Search Console ownership, sitemap submission, URL Inspection | Requires the owner's authenticated Google account |
| Field Core Web Vitals (CrUX) | Only available from real-user data after deployment |
| Sending a real enquiry | Deliberately avoided; the existing stubbed browser tests cover UI behaviour |
| Credential validity | Not tested, because that would mean using possibly-compromised secrets against providers |
