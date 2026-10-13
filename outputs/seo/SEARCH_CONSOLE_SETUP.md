# Google Search Console Setup: Veda Scholars

For the site owner. Steps marked **Owner** need the Google account that manages Search Console; they cannot be done from the codebase.

## 1. DNS verification status (checked 13 October 2026)

Queried directly, with tokens masked:

| Source | TXT records for `vedascholars.com` |
|---|---|
| Authoritative `dns1.registrar-servers.com` (Namecheap) | `v=spf1 …`, `google-site-verification=IYxi…kIE`, `google-site-verification=PLxI…iEM` |
| Authoritative `dns2.registrar-servers.com` | same three records |
| Google Public DNS 8.8.8.8 | same three records |
| Cloudflare 1.1.1.1 | same three records |

- The domain's active nameservers are Namecheap's `registrar-servers.com` pair, so records added in Namecheap Advanced DNS are the ones that count.
- **Both** Google verification tokens are live on the authoritative servers and already visible through Google's public resolver. The newly added `@` record has propagated.
- **Ownership verification is not confirmed.** It can only be confirmed inside Search Console. Two tokens is normal: one may belong to an earlier attempt or another Google service. Keep both until verification succeeds, then remove only a token that Search Console does not list as in use.
- Leave the other records alone: SPF (`v=spf1 … include:spf.web-hosting.com`), `_dmarc` (`p=none`), the MX (`mail.vedascholars.com`), and the `www` CNAME to Vercel.
- **No HTML verification tag was added to the site.** DNS verification covers the whole domain (all hosts and protocols), which is what you want here.

## 2. Verify the Domain property (Owner)

1. Open https://search.google.com/search-console and choose **Add property → Domain**, entering `vedascholars.com` (not a URL-prefix property).
2. Google shows a TXT token. Compare its first four and last three characters with `IYxi…kIE` and `PLxI…iEM` above. If it matches one, click **Verify**. If it matches neither, add it in Namecheap (Host `@`, Type TXT) without deleting the others, wait 15 to 60 minutes, and verify again.
3. If verification still fails, check the token with https://toolbox.googleapps.com/apps/dig/#TXT/vedascholars.com, then retry.

## 3. After the release is deployed (Owner)

1. **Sitemaps → Add a new sitemap:** enter `https://www.vedascholars.com/sitemap.xml`. Expect status "Success" with **14 discovered URLs**. The old sitemap URL is the same, so resubmitting simply refreshes it.
2. **URL Inspection:** inspect `https://www.vedascholars.com/` and then `/about`, `/services`, `/programs`, `/student-journey`, `/for-parents`, `/students`, `/partner-with-us` and `/contact`. For each, check "URL is available to Google", and confirm "User-declared canonical" and "Google-selected canonical" are both the `https://www.` URL. Click **Request indexing** for the main pages (there is a daily quota; prioritise the home page and the main navigation pages).
3. **Test a retired URL**, such as `https://www.vedascholars.com/login`. Live test should report 410 / "Excluded by 'noindex' tag". This is expected and correct.
4. **Settings → Crawl stats:** confirm robots.txt is fetched successfully.

## 4. What to monitor (Owner, weekly for the first month)

| Report | What good looks like |
|---|---|
| **Pages (Indexing)** | The 14 sitemap URLs move to "Indexed" over days to weeks. Retired URLs appear under "Not found (404)/Gone" or "Excluded by noindex", which is expected. "Page with redirect" for `/counselling`, `/partner`, `http://` and apex URLs is also expected. |
| **Duplicate without user-selected canonical** | Should be empty. `?type=` contact links canonicalise to `/contact`. |
| **Sitemaps** | Success, 14 URLs, no errors |
| **Enhancements → Breadcrumbs** | Valid items for the subpages (appears after crawling) |
| **Core Web Vitals** | Appears only once Chrome has enough real-user traffic. Watch mobile LCP for the home page (see the implementation report recommendations). |
| **Security & Manual actions** | "No issues detected" |

Indexing is decided by Google and is not immediate or guaranteed. A submitted sitemap means Google knows the URLs, not that they are indexed.

## 5. Optional

- **Bing Webmaster Tools:** import the verified property from Google Search Console and submit the same sitemap.
- **Analytics:** GA4 is not installed (see the implementation report, recommendation 4). Search Console works without it.
