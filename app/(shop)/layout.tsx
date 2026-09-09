import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, Truck, Zap, Star, Sparkles } from 'lucide-react'
import { CartIcon } from '@/components/cart-icon'
import { MobileNavToggle, MobileNavDrawer } from '@/components/MobileNav'
import { CartNotification } from '@/components/CartNotification'
import { FlyToCart } from '@/components/FlyToCart'
import { SearchModal } from '@/components/SearchModal'
import { FloatingContactWidget } from '@/components/FloatingContactWidget'
import { StickyMobileBuyBar } from '@/components/StickyMobileBuyBar'
import { VisitorBeacon } from '@/components/analytics/VisitorBeacon'
import { getSettings } from '@/lib/data-store'

export const metadata = {
  title: "Dream Frame — Cadres 3D d'Exception & Art Automobile",
}

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080807] text-white flex flex-col antialiased selection:bg-amber-400 selection:text-black">
      <VisitorBeacon />
      <ShopHeader />
      {/* Animation Projectile : Boule ronde blanche qui vole du bouton vers le panier */}
      <FlyToCart />
      {/* Notification Toast : Fond blanc, écriture noire, forme ronde */}
      <CartNotification />
      {/* Drawer mobile — rendu au niveau racine pour dépasser le header sticky */}
      <MobileNavDrawer />
      <div className="flex-1">{children}</div>
      {/* Barre d'Achat Mobile Récurrente Flottante (1-Tap Mobile Conversion) */}
      <StickyMobileBuyBar />
      <ShopFooter />
    </div>
  )
}

// ─── Header ──────────────────────────────────────────────────────────────────

function ShopHeader() {
  let announcementText = 'LIVRAISON COLISSIMO SUIVIE 100% OFFERTE · EXPÉDITION 24/48H'
  let announcementEnabled = false
  let logoPosition: 'left' | 'center' | 'right' = 'center'
  let announcementPosition: 'top' | 'below' = 'top'
  let headerStyle: 'glass' | 'solid' | 'gold' = 'glass'

  try {
    const s = getSettings()
    if (s.announcementBarText) announcementText = s.announcementBarText
    if (s.announcementBarEnabled !== undefined) announcementEnabled = s.announcementBarEnabled
    if (s.headerLogoPosition) logoPosition = s.headerLogoPosition
    if (s.announcementBarPosition) announcementPosition = s.announcementBarPosition
    if (s.headerStyle) headerStyle = s.headerStyle
  } catch {}

  const headerStyleClasses =
    headerStyle === 'gold'
      ? 'bg-[#080807]/95 backdrop-blur-md border-b border-amber-400/40 shadow-lg shadow-amber-400/5'
      : headerStyle === 'solid'
      ? 'bg-[#080807] border-b border-neutral-800'
      : 'bg-[#080807]/80 backdrop-blur-md border-b border-white/[0.05]'

  const AnnouncementComponent = announcementEnabled ? (
    <div className="bg-neutral-950 border-b border-neutral-800/60 text-center py-1.5 px-4">
      <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-amber-300/90 font-light">
        {announcementText}
      </p>
    </div>
  ) : null

  const LogoComponent = (
    <Link href="/" className="group py-1 block focus:outline-none">
      <Image
        src="/images/dream-frame-luxury-logo.png"
        alt="Dream Frame — Votre Passion Mérite Son Cadre"
        width={160}
        height={65}
        priority
        className="h-8 sm:h-11 w-auto object-contain brightness-110 transition-transform duration-300 group-hover:scale-105"
      />
    </Link>
  )

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-200 ${headerStyleClasses}`}>
      {/* Bandeau Annonce Position Haut */}
      {announcementPosition === 'top' && AnnouncementComponent}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        {/* Gauche : Menu Hamburger */}
        <div className="flex items-center flex-1 justify-start">
          <MobileNavToggle />
        </div>

        {/* Centre : Logo Dream Frame centré et discret */}
        <div className="flex items-center justify-center">
          {LogoComponent}
        </div>

        {/* Droite : Recherche à droite et Panier discret */}
        <div className="flex items-center justify-end flex-1 gap-2 sm:gap-3">
          <SearchModal />
          <CartIcon />
        </div>
      </div>

      {/* Bandeau Annonce Position Sous le Header */}
      {announcementPosition === 'below' && AnnouncementComponent}
    </header>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function ShopFooter() {
  const year = new Date().getFullYear()

  const pillars = [
    {
      icon: Truck,
      title: 'Livraison 100% Offerte',
      desc: 'Colissimo Suivi en France sous 24/48h, sans minimum.',
      color: 'text-emerald-400',
    },
    {
      icon: ShieldCheck,
      title: 'Satisfait ou Remboursé',
      desc: 'Droit légal de rétractation 14 jours, retour simplifié.',
      color: 'text-amber-400',
    },
    {
      icon: Zap,
      title: 'Éclairage LED Inclus',
      desc: 'Chaque cadre intègre son bandeau micro-LED rétroéclairé.',
      color: 'text-amber-400',
    },
    {
      icon: Star,
      title: 'Manufacture Française',
      desc: 'Assemblage minutieux et contrôle qualité unitaire.',
      color: 'text-amber-400',
    },
  ]

  return (
    <footer className="border-t border-neutral-800/60 bg-neutral-950/70 mt-20">
      {/* Piliers de confiance */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
          {pillars.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="font-bold text-xs uppercase tracking-wider text-white">{title}</p>
              <p className="text-neutral-500 text-xs leading-relaxed font-light">{desc}</p>
            </div>
          ))}
        </div>

        {/* Section Contact & Assistance Atelier */}
        <div className="border-t border-neutral-800/60 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Contactez-nous &amp; Assistance Atelier</h4>
            <p className="text-neutral-400 text-xs font-light">Une question sur un modèle, un format ou votre commande ? Notre équipe vous répond rapidement.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a
              href="mailto:contact@dreamframe.fr"
              className="px-5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition"
            >
              contact@dreamframe.fr
            </a>
          </div>
        </div>

        {/* Bas de footer */}
        <div className="border-t border-neutral-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg border border-neutral-800 relative grayscale opacity-50">
              <Image src="/logo.jpg" alt="Dream Frame" fill className="object-cover" />
            </div>
            <span className="font-light">© {year} DREAM FRAME. TOUS DROITS RÉSERVÉS.</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-semibold tracking-wider uppercase">
            {[
              ['Mentions légales', '/mentions-legales'],
              ['CGV', '/cgv'],
              ['Confidentialité', '/confidentialite'],
              ['Cookies', '/cookies'],
              ['Rétractation', '/retractation'],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="hover:text-white transition-colors duration-200">
                {label}
              </Link>
            ))}
          </nav>

          <p className="text-[10px] text-neutral-600 tracking-wider">
            MÉDIATION : CM2C
          </p>
        </div>
      </div>
    </footer>
  )
}
