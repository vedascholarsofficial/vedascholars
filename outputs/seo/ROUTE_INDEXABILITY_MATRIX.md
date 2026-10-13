# Route Indexability Matrix: Veda Scholars

Measured on the local production build after the changes (`next start`, 13 October 2026). Canonical origin: `https://www.vedascholars.com`. "Canonical" is the `<link rel="canonical">` emitted in the HTML. On the production host no `X-Robots-Tag` is sent for public pages; on any other host (`*.vercel.app`, previews, localhost) every response carries `X-Robots-Tag: noindex, nofollow`.

## Indexable public pages (in the sitemap)

| Route | HTTP | Canonical | Indexability | Sitemap | Metadata | Decision |
|---|---|---|---|---|---|---|
| `/` | 200 | `https://www.vedascholars.com` | index, follow | Yes | Own title, description, OG/X, Organization + WebSite JSON-LD | Primary landing page |
| `/about` | 200 | self | index, follow | Yes | Own + breadcrumb | Primary |
| `/student-journey` | 200 | self | index, follow | Yes | Own + breadcrumb | Primary (main nav) |
| `/services` | 200 | self | index, follow | Yes | Own + breadcrumb | Primary (main nav) |
| `/programs` | 200 | self | index, follow | Yes | Own + breadcrumb | Primary (main nav) |
| `/for-parents` | 200 | self | index, follow | Yes | Own + breadcrumb | Primary (main nav) |
| `/students` | 200 | self | index, follow | Yes | Own + breadcrumb | Distinct study-abroad landing page (footer, ad landing page); not a duplicate of `/student-journey` |
| `/partner-with-us` | 200 | self | index, follow | Yes | Own + breadcrumb | Primary B2B page (universities and employers) |
| `/contact` | 200 | self | index, follow | Yes | Own + breadcrumb | Primary conversion page. `?type=` variants canonicalise to `/contact` |
| `/psychometric-test` | 200 | self | index, follow | Yes | Own + breadcrumb | Informational tool (career interest check) |
| `/careers` | 200 | self | index, follow | Yes | Own + breadcrumb | Informational (hiring at Veda Scholars) |
| `/privacy-policy` | 200 | self | index, follow | Yes | Own + breadcrumb | Legal |
| `/terms-of-service` | 200 | self | index, follow | Yes | Own + breadcrumb | Legal |
| `/cookie-policy` | 200 | self | index, follow | Yes | Own + breadcrumb | Legal |

## Aliases (permanent redirects)

| Route | HTTP | Target | Indexability | Sitemap | Decision |
|---|---|---|---|---|---|
| `/counselling` | 308 | `/contact?type=student` | Not indexable (redirect) | No | Alias, single hop |
| `/book-counselling` | 308 | `/contact?type=student` | Not indexable | No | Alias |
| `/get-started` | 308 | `/contact?type=student` | Not indexable | No | Alias |
| `/partner` | 308 | `/contact?type=partner` | Not indexable | No | Alias; destination kept as in production (query strings are preserved) |

## Utility pages (noindex)

| Route | HTTP | Canonical | Indexability | Sitemap | Decision |
|---|---|---|---|---|---|
| `/thank-you` | 200 | none | **noindex, follow** (new) | No | Confirmation page; crawlable so the noindex is honoured |
| `/no-longer-available` | 200 | none | noindex, follow | No | Explanation page shown for retired routes |
| Unknown URL (e.g. `/does-not-exist`) | **404** | none | noindex | No | Branded 404 (new), single title |

## Retired routes (HTTP 410 Gone, `X-Robots-Tag: noindex`)

The page source for these routes still exists, but `src/proxy.ts` answers 410 before any page renders, so the source's own metadata never reaches a crawler. None emits a canonical or `og:url`. None is disallowed in robots.txt, so crawlers can see the 410. None redirects to the home page.

| Route (and all sub-paths) | Former purpose | HTTP | Sitemap |
|---|---|---|---|
| `/login`, `/register` | Accounts | 410 | No |
| `/auth`, `/auth/callback` | Google sign-in / OAuth callback | 410 | No |
| `/forgot-password`, `/reset-password/[token]` | Password recovery | 410 | No |
| `/jobs`, `/jobs/[id]`, `/jobs/apply`, `/jobs/create` | Job listings and applications | 410 | No |
| `/dashboard` (+ `/admin`, `/student`, `/recruiter`, `/university`) | Portal dashboards | 410 | No |
| `/profile`, `/settings`, `/resume`, `/applications` | Portal account pages | 410 | No |
| `/vedabot` | AI assistant | 410 | No |
| `/admin/jobs`, `/admin/universities` | Admin | 410 | No |
| `/universities` | Former university directory (portal) | 410 | No |

**Note on `/universities`:** the brief lists it as a primary page, but in production it is the retired portal directory and answers 410. University partnership content lives at `/partner-with-us`. It was left retired. Reviving it would need a new page and an owner decision.

Look-alike paths (`/logins`, `/jobsite`) correctly return 404, not 410.

## Machine-readable endpoints

| Route | HTTP | Content-Type | Notes |
|---|---|---|---|
| `/sitemap.xml` | 200 | `application/xml` | 14 URLs, matching the indexable table above |
| `/robots.txt` | 200 | `text/plain` | `Allow: /`, `Disallow: /api/`, sitemap line. Preview builds: `Disallow: /` |
| `/opengraph-image` | 200 | `image/png` | 1200 × 630, 153 KB |
| `/api/leads` | POST only | JSON | Disallowed in robots.txt; unchanged |
