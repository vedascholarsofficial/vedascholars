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
validates, filters spam, stores the enquiry in MongoDB and emails the business
inbox. It needs the `LEADS_*` and `SMTP_*` variables listed in `.env.example`;
without them it refuses submissions (HTTP 503) rather than showing a false
success. The frontend needs no backend secrets. Never commit secrets.

The API's variables are listed in `server/.env.example`. The API refuses to
start without a strong `JWT_SECRET`.

## Tests

- Frontend (lead pipeline, retired routes, navigation, internal links): `npm test`
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
