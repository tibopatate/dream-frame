'use client'

import { useState, useEffect } from 'react'
import {
  Compass,
  X,
  ArrowUpRight,
  Check,
  Zap,
} from 'lucide-react'

export interface InAppBrowserInfo {
  isInApp: boolean
  app: 'instagram' | 'tiktok' | 'facebook' | 'messenger' | 'twitter' | 'snapchat' | 'other' | null
  appName: string
  isIOS: boolean
  isAndroid: boolean
}

/**
 * Détecte si la page est ouverte dans la Webview d'une application sociale
 * (Instagram, TikTok, Facebook, Snapchat, etc.)
 */
export function detectInAppBrowser(): InAppBrowserInfo {
  if (typeof window === 'undefined' || !window.navigator) {
    return { isInApp: false, app: null, appName: '', isIOS: false, isAndroid: false }
  }

  const ua = window.navigator.userAgent || window.navigator.vendor || (window as any).opera || ''
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)
  const isAndroid = /Android/i.test(ua)

  // Paramètre d'URL pour tester facilement sur tout navigateur (?test_iab=1 ou ?iab=true)
  const urlParams = new URLSearchParams(window.location.search)
  const testIAB = urlParams.get('test_iab') === '1' || urlParams.get('iab') === 'true'

  let app: InAppBrowserInfo['app'] = null
  let appName = ''

  if (/Instagram/i.test(ua)) {
    app = 'instagram'
    appName = 'Instagram'
  } else if (/TikTok|musical_ly|BytedanceWebview/i.test(ua)) {
    app = 'tiktok'
    appName = 'TikTok'
  } else if (/FBAN|FBAV|FB_IAB|FBSS/i.test(ua)) {
    app = 'facebook'
    appName = 'Facebook'
  } else if (/Messenger/i.test(ua)) {
    app = 'messenger'
    appName = 'Messenger'
  } else if (/Twitter/i.test(ua)) {
    app = 'twitter'
    appName = 'X'
  } else if (/Snapchat/i.test(ua)) {
    app = 'snapchat'
    appName = 'Snapchat'
  } else if (testIAB) {
    app = 'instagram'
    appName = 'Instagram'
  } else {
    // Vérification du referrer
    const ref = typeof document !== 'undefined' && document.referrer ? document.referrer.toLowerCase() : ''
    const isWebview =
      /WebView|Android.*wv/i.test(ua) ||
      (isIOS && !(window as any).MSStream && !/Safari/i.test(ua))

    if (ref.includes('instagram.com') || ref.includes('l.instagram.com')) {
      app = 'instagram'
      appName = 'Instagram'
    } else if (ref.includes('tiktok.com')) {
      app = 'tiktok'
      appName = 'TikTok'
    } else if (ref.includes('facebook.com') || ref.includes('l.facebook.com')) {
      app = 'facebook'
      appName = 'Facebook'
    } else if (isWebview && (ref.includes('snapchat.com') || ref.includes('t.co'))) {
      app = 'other'
      appName = 'Réseau social'
    }
  }

  return {
    isInApp: Boolean(app !== null || testIAB),
    app,
    appName: appName || 'Réseau social',
    isIOS,
    isAndroid,
  }
}

/**
 * Bannière flottante ultra-légère et non-bloquante.
 * Ne coupe jamais l'élan du visiteur : elle flotte en haut sans assombrir ni bloquer la page.
 */
export function InAppBrowserRedirector() {
  const [browserInfo, setBrowserInfo] = useState<InAppBrowserInfo | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showIOSHint, setShowIOSHint] = useState(false)

  useEffect(() => {
    const info = detectInAppBrowser()
    setBrowserInfo(info)

    // Vérifier si déjà fermé durant cette session
    const dismissed = sessionStorage.getItem('df_iab_dismissed') === 'true'

    if (info.isInApp && !dismissed) {
      // Apparition douce après 600ms pour ne pas heurter le chargement
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [])

  if (!browserInfo?.isInApp || !isVisible) {
    return null
  }

  const handleDismiss = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setIsVisible(false)
    setShowIOSHint(false)
    try {
      sessionStorage.setItem('df_iab_dismissed', 'true')
    } catch {}
  }

  const handleAction = async () => {
    if (typeof window === 'undefined') return

    // 1. Sur Android : Intent Chrome direct (1-tap vers l'app Chrome)
    if (browserInfo.isAndroid) {
      const cleanUrl = window.location.href.replace(/^https?:\/\//, '')
      window.location.href = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`
      return
    }

    // 2. Sur iOS : Tenter le partage natif (qui permet de choisir "Ouvrir dans Safari")
    if (browserInfo.isIOS && navigator.share) {
      try {
        await navigator.share({
          title: 'Dream Frame',
          url: window.location.href,
        })
        return
      } catch {
        // En cas de refus de partage, on active l'aide visuelle •••
      }
    }

    // 3. Fallback iOS / Copie du lien + indication visuelle discrète
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
      }
    } catch {}

    setCopied(true)
    setShowIOSHint(true)
    setTimeout(() => {
      setCopied(false)
    }, 4000)
  }

  return (
    <>
      {/* ─── Micro-Indicateur Flottant en Haut à Droite (quand on clique sur iOS) ─── */}
      {showIOSHint && (
        <div className="fixed top-2 right-3 z-[100000] pointer-events-none animate-bounce flex items-center gap-1.5">
          <span className="text-[11px] font-bold font-mono tracking-wide bg-amber-400 text-black px-3 py-1.5 rounded-full shadow-2xl border border-amber-300">
            Touchez ••• puis « Ouvrir dans Safari »
          </span>
          <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-black font-bold">
            <ArrowUpRight className="w-4 h-4 stroke-[3]" />
          </div>
        </div>
      )}

      {/* ─── Pastille / Bannière Flottante Non-Intrusive (Zéro Bloquage) ─── */}
      <aside
        aria-label="Optimisation de navigation"
        className="fixed top-3 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-[99999] pointer-events-auto animate-fade-in"
      >
        <div
          onClick={handleAction}
          className="relative group cursor-pointer bg-[#0E0E0C]/95 hover:bg-[#141410] border border-amber-400/40 hover:border-amber-400/70 rounded-2xl p-2.5 sm:p-3 shadow-[0_12px_36px_rgba(0,0,0,0.85)] backdrop-blur-xl flex items-center justify-between gap-3 transition-all duration-300 active:scale-[0.99]"
        >
          {/* Liseré lumineux discret */}
          <div className="absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

          {/* Icône & Titre */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-white tracking-tight leading-tight truncate">
                Ouvrir dans un navigateur pour plus de rapidité
              </p>
              <p className="text-[10px] text-neutral-400 font-light truncate mt-0.5">
                {copied
                  ? '✓ Lien copié ! Ouvrez Safari et collez'
                  : 'Affichage 3D & Apple Pay 1-clic'}
              </p>
            </div>
          </div>

          {/* Bouton CTA d'ouverture rapide & Bouton Fermer */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleAction()
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-[11px] font-bold tracking-wide flex items-center gap-1 transition shadow-sm cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Copié</span>
                </>
              ) : (
                <>
                  <span>Ouvrir</span>
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Fermer la notification"
              className="w-7 h-7 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/60 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
