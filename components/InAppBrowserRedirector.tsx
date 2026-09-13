'use client'

import { useState, useEffect } from 'react'
import {
  X,
  ArrowUpRight,
  Check,
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
 * Pop-up ultra-épuré pour les visiteurs arrivant depuis les réseaux sociaux.
 * Titre direct + bouton d'action 1-tap, sans encombrement.
 */
export function InAppBrowserRedirector() {
  const [browserInfo, setBrowserInfo] = useState<InAppBrowserInfo | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showIOSHint, setShowIOSHint] = useState(false)

  useEffect(() => {
    try {
      const info = detectInAppBrowser()
      setBrowserInfo(info)

      // Vérifier si déjà fermé durant cette session
      const dismissed = sessionStorage.getItem('df_iab_dismissed') === 'true'
      if (info.isInApp && !dismissed) {
        // Apparition douce après 500ms
        const timer = setTimeout(() => {
          setIsVisible(true)
        }, 500)
        return () => clearTimeout(timer)
      }
    } catch {
      // Ignorer erreurs éventuelles d'accès au storage
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

  const handleAction = async (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (typeof window === 'undefined') return

    // 1. Sur Android : Intent Chrome direct (1-tap vers l'application Chrome)
    if (browserInfo.isAndroid) {
      const cleanUrl = window.location.href.replace(/^https?:\/\//, '')
      window.location.href = 'intent://' + cleanUrl + '#Intent;scheme=https;package=com.android.chrome;end'
      return
    }

    // 2. Sur iOS : Tenter le partage natif (permet de sélectionner "Ouvrir dans Safari")
    if (browserInfo.isIOS && typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Dream Frame',
          url: window.location.href,
        })
        return
      } catch {
        // Si l'utilisateur annule la feuille de partage, afficher l'aide visuelle
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
        <aside
          aria-label="Aide Safari"
          className="fixed top-3 right-3 z-[100000] pointer-events-none animate-bounce flex items-center gap-2"
        >
          <span className="text-[11px] font-bold font-mono tracking-wide bg-amber-400 text-black px-3 py-1.5 rounded-full shadow-2xl border border-amber-300">
            Touchez ••• puis « Ouvrir dans Safari »
          </span>
          <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-black font-bold shadow-lg">
            <ArrowUpRight className="w-4 h-4 stroke-[3]" />
          </div>
        </aside>
      )}

      {/* ─── Fond semi-transparent : un simple tap ferme le pop-up instantanément sans bloquer ─── */}
      <div
        onClick={handleDismiss}
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[99998] transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* ─── Pop-up Ultra-Épuré et Propre ─── */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Ouvrir dans un navigateur"
        className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-[99999] animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <div className="relative overflow-hidden bg-[#0E0E0C]/95 border border-amber-400/40 rounded-2xl p-4 shadow-[0_16px_48px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-white">
          {/* Liseré lumineux or discret */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />

          {/* Bouton fermer ✕ discret en haut à droite */}
          <div className="flex justify-end mb-1">
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Fermer le pop-up"
              className="w-7 h-7 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/60 flex items-center justify-center transition cursor-pointer -mr-1 -mt-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Titre Unique & Direct */}
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug mb-3 pr-4">
            Ouvrir dans un navigateur pour plus de rapidité
          </h3>

          {/* Boutons d'action */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleAction}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-amber-400/20 active:scale-[0.98] cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Lien copié ! Ouvrez Safari</span>
                </>
              ) : (
                <>
                  <span>
                    {browserInfo.isIOS
                      ? 'Ouvrir dans Safari'
                      : browserInfo.isAndroid
                      ? 'Ouvrir dans Google Chrome'
                      : 'Ouvrir dans le navigateur'}
                  </span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="w-full py-1 text-center text-[11px] text-neutral-400 hover:text-neutral-200 transition cursor-pointer"
            >
              Continuer sur le site
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
