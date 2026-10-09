# Veda Scholars frontend

Next.js App Router frontend using React, TypeScript, and Tailwind CSS.

## Local setup

Use Node.js 22 and install dependencies with `npm ci`.
Run `npm run dev` and open http://localhost:3000.
Run `npm run build` to check the production build, then `npm start` to serve it.

## API configuration

The Express backend is a separate application in `server/`.
Set `NEXT_PUBLIC_API_URL` in `.env.local` for development or in the hosting
provider environment settings for production. Include `/api` in the URL,
for example `https://api.example.com/api`, and rebuild after changing it.
Development defaults to `http://localhost:5000/api`; production defaults to
same-origin `/api`. Authentication, jobs, dashboards, and AI tools require the
backend to be deployed and reachable at that URL.

The Next.js contact email endpoint additionally requires `EMAIL_USER` and
`EMAIL_PASS` in the hosting provider server environment. Never commit secrets.

## Deployment

The existing GitHub repository is connected to Vercel. Updates to `main`
trigger the production deployment.

- Custom domain: https://www.vedascholars.com
- Vercel domain: https://vedascholars.vercel.app

For Netlify, `netlify.toml` uses `npm run build` and the `.next` publish directory
for its Next.js adapter. This project uses route handlers, middleware, and
dynamic routes, so it should be deployed with a Next.js runtime.
