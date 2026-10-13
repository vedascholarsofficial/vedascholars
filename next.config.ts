import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const CANONICAL_HOST = "www.vedascholars.com";
const TURNSTILE_ORIGIN = "https://challenges.cloudflare.com";

// Origin of the Express API (NEXT_PUBLIC_API_URL includes the /api path).
const apiOrigin = (() => {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (!configured) return isDev ? "http://localhost:5000" : "";
  try {
    return new URL(configured).origin;
  } catch {
    return "";
  }
})();

// Next.js injects inline bootstrap scripts, so script-src needs
// 'unsafe-inline' without a nonce setup. The policy still blocks framing,
// plugins, base-tag injection, foreign form targets and unknown origins.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${TURNSTILE_ORIGIN}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://upload.wikimedia.org",
  "font-src 'self' data:",
  `connect-src 'self' ${apiOrigin} ${TURNSTILE_ORIGIN}${isDev ? " ws://localhost:* http://localhost:*" : ""}`.trim(),
  `frame-src ${TURNSTILE_ORIGIN}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Only the canonical host may be indexed. Deployment URLs such as
      // *.vercel.app, preview deployments and any old Netlify site are not.
      {
        source: "/:path*",
        missing: [{ type: "host", value: CANONICAL_HOST }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
