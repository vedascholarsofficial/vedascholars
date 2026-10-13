import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Source_Serif_4 } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/marketing/Analytics";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { MotionProvider } from "@/components/animations/Reveal";
import ScrollProgress from "@/components/animations/ScrollProgress";
import { AuthProvider } from "@/context/AuthContext";
import { SITE_URL } from "@/lib/site";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const serif = Source_Serif_4({
  variable: "--font-serif-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Site-wide defaults. Indexable pages override title, description, canonical,
// Open Graph and X tags with pageMetadata() (src/lib/seo.ts). No default
// canonical or og:url here: a page without its own must not claim to be the
// home page. Preview images come from opengraph-image.tsx / twitter-image.tsx.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${serif.variable}`}>
      <body
        className="antialiased bg-white text-slate-900 font-body flex flex-col min-h-screen"
      >
        <Analytics />
        <MotionProvider>
          <ScrollProgress />
          <AuthProvider>
            <Header />
            <main className="flex-grow pt-20">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </MotionProvider>
        <WhatsAppButton />
      </body>
    </html>
  );
}
