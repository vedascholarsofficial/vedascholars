# Veda Scholars frontend

Next.js App Router frontend using React, TypeScript, and Tailwind CSS.

## Local setup

Use Node.js 22 and install dependencies with `npm ci`.
Run `npm run dev` and open http://localhost:3000.
Run `npm run build` to check the production build, then `npm start` to serve it.

## Public website and retired routes

The website is a public, consultation-focused site with no sign-in. Online
accounts (login, registration, Google sign-in, password reset), job
applications and the portal (dashboards, résumé builder, VedaBot, university
directory) are retired: `src/proxy.ts` answers those routes with HTTP 410 and a
page pointing to Contact Us. The list lives in `RETIRED_ROUTE_PREFIXES` in
`src/lib/site.ts`, next to the header navigation. Their page code, the Express
API in `server/` and all stored data are kept, but the public website does not
call the API, so `NEXT_PUBLIC_API_URL` is not needed.

The API keeps its security fixes and has public sign-up closed by default
(`PUBLIC_SIGNUP_ENABLED`); existing accounts can still sign in to it.

The contact form posts to `/api/leads`, a server-side enquiry pipeline that
validates, filters spam, stores the enquiry in MongoDB and emails the admin
inbox plus a confirmation to the submitter. Set `RESEND_API_KEY`,
`LEADS_MAIL_FROM` (a sender on a verified Resend domain), `LEADS_NOTIFY_TO`
(the monitored admin inbox), and `LEADS_IP_HASH_SALT` (32+ random characters)
in `.env` or hosting environment settings. Restart the development server
after changing these settings; `.env.local` takes precedence over `.env`.
Resend uses its server-side HTTPS API: https://resend.com/docs/api-reference/emails/send-email.
The existing `SMTP_*` settings retain their admin-only behavior when Resend
is not configured. No mail credentials are exposed to the browser.

MongoDB storage is optional with working email, but recommended for durable
records and rate limits across instances. Without storage, acceptance requires
the admin email to succeed. With storage, email failures are logged and admin
notification failures are recorded on the stored enquiry; confirmation failures
do not reject an already accepted enquiry. There is no automatic retry worker.
Without either storage or working email configuration, submissions are refused
(HTTP 503). Never commit secrets.

The API's variables are listed in `server/.env.example`. The API refuses to
start without a strong `JWT_SECRET`.

## SEO

Every indexable page is listed in `INDEXABLE_PAGES` in `src/lib/seo.ts` with
its title, description and the date its content last changed. That list
drives the sitemap, and each page exports `pageMetadata('<path>')` for its
title, canonical URL, Open Graph and X tags. When you add a public page, add
it there; when you change a page's content, update its `lastModified` date.
Utility pages (such as `/thank-you`) are `noindex`; retired routes answer 410.
`npm test` fails if a page is not classified.

The social preview image is generated at build time by
`src/app/opengraph-image.tsx`. `robots.txt` blocks Vercel preview builds, and
`next.config.ts` sends `X-Robots-Tag: noindex` on every host except
www.vedascholars.com. Search Console steps are in `outputs/seo/`.

## Tests

- Frontend (lead pipeline, retired routes, navigation, internal links, SEO metadata, sitemap, robots, structured data): `npm test`
- API (auth, closed sign-up, permissions, data exposure): `cd server && npm test`
- Runtime checks against a production build (410s, header, crawl for broken
  links, mobile menu keyboard behaviour, contact form): `npm run build`, start
  it with `npx next start -p 3100` and **no** `LEADS_*`/`SMTP_*` variables, then
  `BASE_URL=http://localhost:3100 npm run test:e2e`. Browser tests use an
  installed Chrome or Edge and are skipped if neither is found.

The unit suites use an in-memory MongoDB; no real database or email is touched.

## Deployment

The existing GitHub repository is connected to Vercel. Updates to `main`
trigger the production deployment.

- Custom domain: https://www.vedascholars.com
- Vercel domain: https://vedascholars.vercel.app

For Netlify, `netlify.toml` uses `npm run build` and the `.next` publish directory
for its Next.js adapter. This project uses route handlers, middleware, and
dynamic routes, so it should be deployed with a Next.js runtime.
