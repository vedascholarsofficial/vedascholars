# SEO Implementation Report: Veda Scholars

Date: 13 October 2026. All changes are local and uncommitted on `main`; nothing has been pushed or deployed.

## 1. Summary

- Every indexable page now has its own title, description, canonical URL, `og:url`, Open Graph and X tags, and a working 1200 × 630 preview image.
- One registry (`INDEXABLE_PAGES` in `src/lib/seo.ts`) drives page metadata and the sitemap, so they cannot drift apart. A test fails if any new route is left unclassified.
- Organization, WebSite and BreadcrumbList structured data were added, using only facts the site already publishes.
- Alias URLs are now single-hop permanent (308) redirects. `/thank-you` is noindex, and unknown URLs get a branded 404 with a single title.
- Two pre-existing usability defects were fixed: mobile horizontal scrolling on two pages, and unreadable text on `/careers`.
- The design, the contact enquiry pipeline, retired-route 410 handling and the security headers are unchanged.

## 2. Files changed

**New**

| File | Purpose |
|---|---|
| `src/lib/seo.ts` | `INDEXABLE_PAGES` registry (title, description, breadcrumb name, content date); `pageMetadata()`; `SOCIAL_IMAGE`; `NOINDEX`; JSON-LD builders |
| `src/components/seo/JsonLd.tsx` | Renders JSON-LD with `<` escaped |
| `src/app/opengraph-image.tsx` | Generates the 1200 × 630 brand preview image at build time |
| `src/assets/og/*.woff`, `OFL-*.txt` | Plus Jakarta Sans 500/700 and Source Serif 4 italic (SIL OFL 1.1, licence files included). WOFF is needed because the image renderer cannot read WOFF2. |
| `src/app/not-found.tsx` | Branded 404 (one title, noindex added by Next.js) |
| `src/app/thank-you/layout.tsx` | `noindex, follow` for the confirmation page |
| `tests/seo.test.ts` | 12 unit tests |
| `tests/e2e/seo.test.ts` | 11 runtime tests against a production build |

**Modified**

| File | Change |
|---|---|
| `src/app/layout.tsx` | Defaults only; removed home-page `og:url`/titles/images so subpages cannot inherit them |
| `src/app/page.tsx` and 11 page files: `about`, `contact`, `students`, `services`, `programs`, `careers`, `for-parents`, `student-journey`, `privacy-policy`, `terms-of-service`, `cookie-policy` | `metadata = pageMetadata('<path>')`; JSON-LD (Organization + WebSite on `/`, BreadcrumbList elsewhere); removed `keywords` |
| `src/app/partner-with-us/layout.tsx`, `src/app/psychometric-test/layout.tsx` | Same, for client-component pages |
| `src/app/sitemap.ts` | Built from `INDEXABLE_PAGES`; real content dates; dropped ignored `changefreq`/`priority` |
| `src/app/robots.ts` | Disallow-all on Vercel preview builds; production disallows only `/api/` (noindex pages are now crawlable so their noindex is seen) |
| `next.config.ts` | Permanent redirects for the four alias URLs |
| `src/components/layout/Footer.tsx` | Website link uses the canonical URL, same tab |
| `src/app/careers/page.tsx` | Light-section text `slate-300` changed to `slate-600` (contrast) |
| `src/components/students/ProgramsAndScholarships.tsx`, `src/components/universities/UniversitiesContent.tsx` | `overflow-x-clip` on one section each; the slide-in animation is unchanged |
| `tests/routes.test.ts`, `tests/e2e/site.test.ts` | Updated for `pageMetadata` and the new "For Parents and Families" title |
| `README.md` | Short SEO maintenance section |

**Deleted**: `src/app/opengraph-image.png` (500 × 500 badge), and `src/app/{counselling,book-counselling,get-started,partner}/page.tsx` (replaced by config redirects).

## 3. Metadata

Titles use `title.absolute` so the brand appears once: `<Page title> | Veda Scholars`, and the home page is `Veda Scholars | Education to Employment Consultancy`.

| Path | Title | Changed? |
|---|---|---|
| `/` | Veda Scholars \| Education to Employment Consultancy | No |
| `/about` | About Us \| Veda Scholars | Description rewritten (removed "trusted … worldwide") |
| `/student-journey` | Our Student Journey \| Veda Scholars | No |
| `/services` | Services: Five Pillars of Student Support \| Veda Scholars | Separator only |
| `/programs` | Programs: A Connected Student Ecosystem \| Veda Scholars | Separator; shorter description |
| `/for-parents` | For Parents and Families \| Veda Scholars | Title |
| `/students` | Study Abroad & Career Guidance for Students \| Veda Scholars | Description matches services actually listed (visa *guidance*) |
| `/psychometric-test` | Career Interest Check \| Veda Scholars | No |
| `/partner-with-us` | Partner With Us: Universities and Employers \| Veda Scholars | Title |
| `/contact` | Contact Us: Book a Free Consultation \| Veda Scholars | "free first counselling session" matches site copy |
| `/careers` | Careers: Join Our Team \| Veda Scholars | Title and description |
| Legal pages | Privacy Policy / Terms of Service / Cookie Policy \| Veda Scholars | Descriptions clarified |

Each page also emits `og:title`, `og:description`, `og:url` (absolute, equal to the canonical), `og:type=website`, `og:site_name`, `og:locale=en_US`, `og:image` with width, height, type and alt, and `twitter:card=summary_large_image` with title, description and image. Meta keywords were removed.

## 4. Social preview image

`/opengraph-image` is a 1200 × 630 PNG (153 KB), generated once at build time. It uses the aubergine brand background (`#24112d`), the purple accent (`#8b2bb4`), the light wordmark, the home-page line "Empowering your journey from *education to employment*", and two neutral audience lines. It contains no third-party university logos and no claims. It is referenced explicitly by every page, because a page that defines its own `openGraph` does not inherit the root file image (verified in the rendered HTML).

## 5. Structured data

- `/`: `Organization` (name, URL, logo `/images/veda-logo.png`, description, `info@vedascholars.com`, `+91 7708722334`, LinkedIn/YouTube/Facebook/Instagram from the footer, ContactPoint) and `WebSite`.
- Every other indexable page: two-level `BreadcrumbList`.
- Deliberately **not** added: address, ratings, reviews, FAQ markup, accreditation, partner universities, job postings and `Service` (no rich result, and the services list would duplicate visible content). Ask the owner before adding a postal address or `LocalBusiness`.
- Validation done locally: JSON parses and is checked by the tests. Google's Rich Results Test needs a public URL, so run it after deployment (see the release checklist).

## 6. Credential rotation checklist (not executed)

No credential was rotated. That requires the owner's provider accounts and production environment changes, which were outside this task's authorisation. Treat every value that was in the shared export as exposed. Rotate in this order, updating Vercel or the API host **before** revoking the old value so production keeps working:

| Credential | Where used | Rotate at | Then update |
|---|---|---|---|
| `RESEND_API_KEY` | Contact form email (Vercel) | Resend dashboard, API Keys: create new, update Vercel, redeploy, send a test enquiry, delete old | Vercel env (Production) |
| `MONGO_URI` user/password (Atlas cluster `vedascholars.pxfljfw`) | Express API | Atlas, Database Access: new password or new least-privilege user | API host env; `LEADS_MONGODB_URI` if it shares the user |
| `JWT_SECRET` | Express API | Generate 48+ random bytes | API host env (signs out existing sessions) |
| `EMAIL_USER` / `EMAIL_PASS` (Gmail app password) | API OTP/reset mail | Google Account, Security, App passwords: revoke and create | API host env |
| `GEMINI_API_KEY` | VedaBot (retired) | Google AI Studio / Cloud console: delete key | Leave unset (VedaBot is retired) |
| `GOOGLE_CLIENT_SECRET` | Google sign-in (retired) | Google Cloud, Credentials: reset secret, or delete the OAuth client | API host env, or leave unset |

Also:

- Remove backend secrets from the frontend's `.env.local`; the frontend needs none of them.
- Before sharing code again, export only tracked files: `git archive --format=zip -o ../vedascholars-export.zip HEAD`. This omits `.env*` and `server/.env`. Do not zip the working folder.
- Check provider logs (Atlas access, Resend sending, Google console) for use since the export was shared.

The unit suite now fails if an `.env` file or a credential pattern is ever committed.

## 7. Recommendations not implemented (need an owner decision)

1. **Home page LCP** (lab: 5.0 s mobile). The intro curtain plus the staggered hero text reveal delays the largest paint. Options: skip the curtain on first paint for crawlers and slow devices, or shorten it. This changes the premium animation, so it was not changed.
2. **Image weight.** `images.unoptimized: true` sends full PNG and Unsplash originals (`/students` 2.6 MB, `/partner-with-us` up to 9.9 MB). Either enable Vercel image optimisation (check plan usage costs) or convert the large PNGs in `public/images/students` and `public/images/universities` to WebP as was already done for other sections.
3. **`/partner-with-us` employer tab** content is rendered only after a click, so it is not in the server HTML that search engines index first.
4. **Analytics**: none is loaded. To add GA4/GTM, supply a real container ID, add `googletagmanager.com` to the CSP, and add consent handling consistent with the cookie policy. The contact form does not send data to any analytics provider.
5. Delete or align `public/_redirects` (Netlify only; publicly served on Vercel).
6. Pre-existing ESLint errors (266), mostly outside the public site.
