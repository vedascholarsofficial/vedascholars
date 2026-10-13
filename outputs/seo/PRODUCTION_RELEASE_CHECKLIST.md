# Production Release Checklist: SEO Release

**Verdict: GO**, once the owner authorises the release. Nothing has been committed, pushed or deployed. The credential rotation (implementation report, section 6) is urgent but separate: those secrets are not in the repository or the build, and rotating them does not depend on this release.

## Pre-release gates (done locally on 13 October 2026)

| Gate | Status |
|---|---|
| Production build passes, no warnings | ✅ |
| `tsc` passes; lint unchanged from baseline | ✅ |
| Unit 46/46, API 55/55, E2E 30/30 | ✅ |
| No security regressions: CSP/HSTS/frame headers unchanged and asserted on 410 routes; no secrets tracked or bundled | ✅ |
| No broken public pages or internal links (crawl test) | ✅ |
| Canonical domain `https://www.vedascholars.com` on every page, sitemap and robots | ✅ |
| Redirects: aliases 308 in a single hop; retired routes 410 | ✅ |
| Contact enquiry pipeline: code untouched; UI tests pass | ✅ |
| DNS verification status documented | ✅ Records live; ownership not yet confirmed in Search Console |
| Rollback procedure | ✅ Below |

## Release steps (need authorisation)

1. Review the diff (`git status`, `git diff`). Note that `outputs/` contains these reports; decide whether to commit them.
2. Commit on a branch, for example `seo-readiness`, and push it. Vercel builds a **Preview** deployment.
3. On the preview URL, check:
   - `/robots.txt` shows `Disallow: /`. This is expected on previews and proves the preview guard works.
   - Any page has an `X-Robots-Tag: noindex, nofollow` response header.
   - Pages look unchanged; check `/students` and `/partner-with-us` on a phone (no sideways scroll).
4. Merge to `main`. Vercel deploys to production.

## Post-deployment verification (exact URLs)

Run from any terminal:

```bash
# 1. Host and redirects
curl -sI https://www.vedascholars.com/ | head -1                       # HTTP/2 200
curl -sI https://vedascholars.com/ | grep -i location                  # https://www.vedascholars.com/
curl -sI https://www.vedascholars.com/counselling | grep -iE "^HTTP|location"   # 308, /contact?type=student
curl -sI https://www.vedascholars.com/partner | grep -iE "^HTTP|location"       # 308, /contact?type=partner
curl -sI https://www.vedascholars.com/login | grep -iE "^HTTP|x-robots"         # 410, noindex
curl -sI https://www.vedascholars.com/no-such-page | head -1                     # 404

# 2. Crawl files
curl -s https://www.vedascholars.com/robots.txt        # Allow: /, Disallow: /api/, Sitemap line
curl -s https://www.vedascholars.com/sitemap.xml | grep -c "<loc>"   # 14
curl -sI https://www.vedascholars.com/opengraph-image | grep -iE "^HTTP|content-type"   # 200, image/png

# 3. No production noindex on a public page (expect no output)
curl -sI https://www.vedascholars.com/about | grep -i x-robots-tag

# 4. Head tags of a subpage (og:url must be the /about URL, not the home page)
curl -s https://www.vedascholars.com/about | grep -oE '<link rel="canonical"[^>]*>|<meta property="og:(url|title|image)"[^>]*>'
```

Then the automated SEO suite against production. It is read-only: it sends GET requests only and never submits the contact form.

```bash
BASE_URL=https://www.vedascholars.com node --import tsx --test tests/e2e/seo.test.ts
```

Manual checks:

5. **Contact form:** submit one real test enquiry marked "TEST – please ignore". Confirm the admin email and the confirmation email arrive.
6. **Structured data:** https://search.google.com/test/rich-results with `https://www.vedascholars.com/` (Organization) and `https://www.vedascholars.com/services` (Breadcrumb). Also https://validator.schema.org/. Expect no errors.
7. **Social previews:**
   - LinkedIn: https://www.linkedin.com/post-inspector/ with `https://www.vedascholars.com/contact`
   - Facebook: https://developers.facebook.com/tools/debug/ (click "Scrape Again" to clear the old cached 500 px image)
   - X: post a draft containing the link
   - WhatsApp: send the link to yourself. WhatsApp caches previews; use a URL it has not seen, e.g. `https://www.vedascholars.com/about?v=2`, for a fresh check.
8. **Search Console:** follow `SEARCH_CONSOLE_SETUP.md` sections 2 and 3.

## Rollback

- **Fastest:** Vercel dashboard → Project → Deployments → select the previous production deployment → **Instant Rollback** (or "Promote to Production"). No rebuild is needed.
- **In git:** `git revert <merge-commit>` on `main` and push. Vercel redeploys.
- The release changes no data, environment variables or DNS, so rollback has no side effects. The 308 redirects may stay cached in visitors' browsers after a rollback; this is harmless because they point to the same destinations as before.

## Open items after release (not blockers)

- Rotate the credentials listed in the implementation report (urgent, owner).
- Home page mobile LCP and image weight (owner decision).
- Optional analytics setup with consent.
