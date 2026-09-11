import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { ViewTransition } from 'react'
import './globals.css'
import { CookieBanner } from '@/components/cookie-banner'

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
  title: {
    default: 'Dream Frame | Site Officiel',
    template: '%s | Dream Frame | Site Officiel',
  },
  description:
    'Cadres 3D décoratifs premium avec miniature automobile, éclairage LED intégré et vitrine en verre. Assemblés à la main en France. Livraison 100% offerte. 49,99 € TTC.',
  keywords: [
    'cadre voiture 3D',
    'cadre art automobile',
    'miniature voiture sport',
    'décoration auto premium',
    'Dream Frame',
    'Ferrari cadre',
    'Porsche GT3 RS cadre',
  ],
  authors: [{ name: 'Dream Frame' }],
  creator: 'Dream Frame',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Dream Frame',
    title: "Dream Frame — Art Automobile 3D d'Exception",
    description: 'Cadres 3D premium avec miniature automobile et éclairage LED. Assemblés en France. 49,99 € TTC. Livraison 100% offerte.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Dream Frame — Art Automobile 3D' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dream Frame — Art Automobile 3D',
    description: 'Cadres 3D premium avec miniature automobile et éclairage LED.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

// Schema.org Organization JSON-LD
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Dream Frame',
  url: 'https://dreamframeofficiel.com',
  logo: 'https://dreamframeofficiel.com/logo.jpg',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'contact@dreamframe.fr',
    contactType: 'customer service',
    availableLanguage: 'French',
    areaServed: 'FR',
  },
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
        {/* ViewTransition — crossfade natif entre les pages */}
        <ViewTransition>
          {children}
        </ViewTransition>
        <CookieBanner />
      </body>
    </html>
  )
}
