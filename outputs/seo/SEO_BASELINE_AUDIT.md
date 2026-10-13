# SEO Baseline Audit: Veda Scholars

Audit date: 13 October 2026. Branch `main` at `171b193`, clean working tree before changes.
Stack: Next.js 16.4.0 (App Router, Turbopack), React 19.2.3, Tailwind 4, deployed on Vercel from `main`.

## 1. Domain and hosting (live, verified with HTTP requests)

| Request | Result |
|---|---|
| `http://vedascholars.com` | 308 to `https://vedascholars.com/` |
| `https://vedascholars.com` | 308 to `https://www.vedascholars.com/` |
| `http://www.vedascholars.com` | 308 to `https://www.vedascholars.com/` |
| `https://www.vedascholars.com` | 200 (canonical host) |
| `https://vedascholars.vercel.app` | 200 with `X-Robots-Tag: noindex, nofollow` |

**The canonical production origin is `https://www.vedascholars.com`**, not the bare domain named in the brief. The code (`SITE_URL`), Vercel domain settings and live redirects all agree on `www`, so it was kept. `http://vedascholars.com` takes two hops (http to https, then apex to www); this is Vercel domain configuration, not application code.

## 2. Baseline checks

| Check | Result |
|---|---|
| `tsc --noEmit` | Pass |
| `next build` | Pass (49 routes) |
| `npm test` (unit) | 34 / 34 pass |
| `npm run lint` | **266 errors, 57 warnings** across 76 files, all pre-existing (mostly `server/` CommonJS and retired portal pages). Not caused by this work; totals unchanged afterwards. |

## 3. Existing SEO functionality found

- Root `metadataBase`, title template `%s | Veda Scholars`, default description, `robots: index, follow` with `max-image-preview: large`.
- Per-page `title`, `description` and relative `canonical` on 14 public pages.
- `src/app/sitemap.ts` (14 URLs) and `src/app/robots.ts` (Allow `/`, Disallow `/api/`, `/thank-you`, `/no-longer-available`; sitemap reference).
- Retired routes (`/login`, `/register`, `/auth`, `/forgot-password`, `/reset-password`, `/jobs`, `/dashboard`, `/profile`, `/settings`, `/resume`, `/applications`, `/vedabot`, `/admin`, `/universities`) answer **410 Gone** with `X-Robots-Tag: noindex` from `src/proxy.ts`, and render a noindex explanation page.
- `X-Robots-Tag: noindex, nofollow` on every host except `www.vedascholars.com` (protects `*.vercel.app` and previews).
- Security headers (CSP, HSTS, frame denial) and a tested contact enquiry pipeline (`/api/leads`).
- `html lang="en"`, server-rendered content, one `<h1>` per public page.

## 4. Issues identified (from rendered HTML of a local production build and the live site)

| # | Severity | Issue |
|---|---|---|
| 1 | High | **Every subpage inherited the home page's Open Graph and X tags**: `og:url` was `https://www.vedascholars.com`, and `og:title`/`og:description`/`twitter:*` showed the home page text on all pages. Shared links to `/contact` etc. previewed as the home page. Cause: Next.js shallow-merges metadata, and pages set no `openGraph` of their own. |
| 2 | High | **Social image mismatch**: `src/app/opengraph-image.png` was a 500 × 500 gold badge, while the layout declared `/opengraph-image.png` as 1200 × 630. Home page tags said 500 × 500; subpages said 1200 × 630 for the same 500 × 500 file. Poor or cropped previews on LinkedIn, Facebook, X and WhatsApp. |
| 3 | Medium | No structured data (no Organization, WebSite or BreadcrumbList JSON-LD). |
| 4 | Medium | Sitemap `lastmod` was the build time (`new Date()`) for every URL, so every deploy claimed every page changed. |
| 5 | Medium | Alias routes `/counselling`, `/book-counselling`, `/get-started`, `/partner` answered **307 (temporary)** from rendered pages, which also emitted indexable HTML. |
| 6 | Medium | `/thank-you` had no noindex (inherited `index, follow`, no canonical); it was only blocked in robots.txt, which stops crawlers seeing a noindex. |
| 7 | Low | Unknown URLs used the default Next.js 404, which emits **two `<title>` tags**. |
| 8 | Low | Obsolete `keywords` meta on `/` and `/students`. |
| 9 | Low | Title formats mixed pipes inside titles ("Programs \| A Connected Student Ecosystem \| Veda Scholars"). |
| 10 | Low | Footer website link pointed to `https://vedascholars.com/` (a redirect hop) and opened a new tab. |
| 11 | Usability | `/careers` body text used `text-slate-300` on white (contrast about 1.5:1, effectively unreadable). |
| 12 | Usability | `/students` and `/partner-with-us` scrolled horizontally by 14 px on phones (confirmed on the live site) because a slide-in animation starts 30 px off-screen. |
| 13 | Info | Analytics component contains only a commented-out GTM placeholder; no analytics or tag manager is loaded. |
| 14 | Info | `public/_redirects` (Netlify syntax) is served as a public file on Vercel and has no effect there; its `/partner` rule disagrees with production. |

## 5. Security baseline (credentials)

- **Git history**: no `.env` file has ever been committed (only `.env.example` and `server/.env.example`). A pattern scan of all history for MongoDB URIs with passwords, Resend, Google API and Google OAuth secrets found one match: a `user:pass@host` test fixture in `server/test/config.test.js`, not a real credential.
- **Working copy**: real credentials exist only in untracked, git-ignored files: `.env` (Resend key and mail addresses), `.env.local` and `server/.env` (identical: production Atlas `MONGO_URI`, `JWT_SECRET`, Gmail `EMAIL_USER`/`EMAIL_PASS`, `GEMINI_API_KEY`, `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`). Values were never printed during this audit.
- **Build output**: 17 local secret values were compared against 321 client-bundle and prerendered files; **0 matches**. No `NEXT_PUBLIC_` secret exists.
- **Exposure**: the brief states a repository export containing these values was shared. Anything in that export must be treated as compromised. Whether each credential is still active could not be tested without using it against the provider, which was not done. See the rotation checklist in `SEO_IMPLEMENTATION_REPORT.md` section 6.

## 6. Performance baseline (lab, local production build, Chrome, mobile with 4× CPU throttle)

| Page | Mobile LCP | Desktop LCP | CLS | LCP element |
|---|---|---|---|---|
| `/` | 5.0 s | 2.9 s | 0.001 | Hero text (after intro curtain and staggered reveal) |
| `/about` | 0.6 s | 0.2 s | 0 | Image |
| `/services`, `/programs`, `/for-parents`, `/student-journey` | 0.5 to 0.8 s | about 0.2 s | 0 | Hero image |
| `/students` | 0.9 s | 0.2 s | 0 | PNG (2.6 MB page weight) |
| `/partner-with-us` | 1.9 s | 1.9 s | 0 | Unsplash original (up to 9.9 MB page weight on desktop) |

These are lab numbers without network throttling, not field (CrUX) data. `images.unoptimized: true` in `next.config.ts` means large PNG and Unsplash originals are sent at full size.
