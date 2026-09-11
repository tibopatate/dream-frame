import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { ViewTransition } from 'react'
import './globals.css'
import { CookieBanner } from '@/components/cookie-banner'
import { ScrollToTop } from '@/components/ScrollToTop'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080807',
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://dreamframeofficiel.com'),
  alternates: {
    canonical: 'https://dreamframeofficiel.com',
  },
  title: {
    default: 'Dream Frame | Site Officiel — Cadres 3D d’Art Automobile',
    template: '%s | Dream Frame | Site Officiel',
  },
  description:
    'Cadres 3D décoratifs premium avec miniature automobile, éclairage LED intégré et vitrine en verre. Assemblés à la main en France. Livraison 100% offerte. À partir de 49,90 €.',
  keywords: [
    'cadre voiture 3D',
    'cadre art automobile',
    'miniature voiture sport',
    'décoration auto premium',
    'Dream Frame',
    'dreamframe officiel',
    'Ferrari cadre 3D',
    'Porsche GT3 RS cadre',
    'cadre sur mesure voiture',
  ],
  authors: [{ name: 'Dream Frame' }],
  creator: 'Dream Frame',
  openGraph: {
    type: 'website',
    url: 'https://dreamframeofficiel.com',
    locale: 'fr_FR',
    siteName: 'Dream Frame Officiel',
    title: "Dream Frame — Art Automobile 3D d'Exception",
    description: 'Cadres 3D premium avec miniature automobile et éclairage LED. Assemblés en France. À partir de 49,90 €. Livraison 100% offerte.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Dream Frame — Art Automobile 3D' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dream Frame — Art Automobile 3D',
    description: 'Cadres 3D premium avec miniature automobile et éclairage LED. Fait main en France.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '81e1cbc714b9d36c',
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '512x512', type: 'image/png' },
    ],
  },
}

// Schema.org Organization & WebSite JSON-LD
const organizationSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://dreamframeofficiel.com/#organization',
      name: 'Dream Frame',
      url: 'https://dreamframeofficiel.com',
      logo: 'https://dreamframeofficiel.com/logo.jpg',
      sameAs: [
        'https://www.instagram.com/dreamframe996?stkn=cW9yb2NxOG8wOXFw',
        'https://www.tiktok.com/@dreamframe_officiel',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'contact@dreamframe.fr',
        contactType: 'customer service',
        availableLanguage: ['French', 'English'],
        areaServed: ['FR', 'BE', 'CH', 'LU'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://dreamframeofficiel.com/#website',
      url: 'https://dreamframeofficiel.com',
      name: 'Dream Frame — Art Automobile 3D',
      publisher: {
        '@id': 'https://dreamframeofficiel.com/#organization',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={poppins.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="bg-[#080807] text-white antialiased min-h-screen selection:bg-amber-400 selection:text-black">
        <ScrollToTop />
        {/* ViewTransition — crossfade natif entre les pages */}
        <ViewTransition>
          {children}
        </ViewTransition>
        <CookieBanner />
      </body>
    </html>
  )
}
