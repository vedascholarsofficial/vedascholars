import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Source_Serif_4 } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/marketing/Analytics";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { AuthProvider } from "@/context/AuthContext";
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

export const metadata: Metadata = {
  metadataBase: new URL('https://vedascholars.com'),
  title: {
    default: "Veda Scholars | Education to Employment Consultancy",
    template: "%s | Veda Scholars"
  },
  description: "Veda Scholars helps students, universities, and employers bridge the gap between education and employment through global counselling, partnerships, and recruitment support.",
  openGraph: {
    title: "Veda Scholars | Education to Employment Consultancy",
    description: "Veda Scholars helps students, universities, and employers bridge the gap between education and employment through global counselling, partnerships, and recruitment support.",
    url: 'https://vedascholars.com',
    siteName: 'Veda Scholars',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Veda Scholars – Education to Employment Consultancy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Veda Scholars | Education to Employment Consultancy",
    description: "Veda Scholars helps students, universities, and employers bridge the gap between education and employment through global counselling, partnerships, and recruitment support.",
    images: ['/opengraph-image.png'],
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
        <AuthProvider>
          <Header />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
        </AuthProvider>
        <WhatsAppButton />
      </body>
    </html>
  );
}
