'use client'

import { useState, useEffect } from 'react'
import {
  Compass,
  ExternalLink,
  Copy,
  Check,
  Zap,
  X,
  Sparkles,
  ShieldCheck,
  Share2,
  ArrowUpRight,
  Smartphone,
} from 'lucide-react'

export interface InAppBrowserInfo {
  isInApp: boolean
  app: 'instagram' | 'tiktok' | 'facebook' | 'messenger' | 'twitter' | 'snapchat' | 'linkedin' | 'other' | null
  appName: string
  isIOS: boolean
  isAndroid: boolean
}

/**
 * Détecte si le site est actuellement ouvert dans la Webview d'une application sociale
 * (Instagram, TikTok, Facebook, Messenger, X/Twitter, Snapchat, etc.)
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

  // Paramètre d'URL pour tester facilement sur n'importe quel navigateur (ex: ?test_iab=1)
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
    appName = 'X (Twitter)'
  } else if (/Snapchat/i.test(ua)) {
    app = 'snapchat'
    appName = 'Snapchat'
  } else if (/LinkedInApp/i.test(ua)) {
    app = 'linkedin'
    appName = 'LinkedIn'
  } else if (testIAB) {
    app = 'instagram'
    appName = 'Instagram (Test)'
  } else {
    // Vérification du referrer si l'application masque son User-Agent mais reste en Webview
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
    } else if (ref.includes('t.co') || ref.includes('twitter.com')) {
      app = 'twitter'
      appName = 'X'
    } else if (isWebview && (ref.includes('snapchat.com') || ref.includes('pinterest.com'))) {
      app = 'other'
      appName = 'Réseau social'
    }
  }

  const isInApp = Boolean(app !== null || testIAB)

  return {
    isInApp,
    app,
    appName: appName || 'Réseau social',
    isIOS,
    isAndroid,
  }
}

export function InAppBrowserRedirector() {
  const [browserInfo, setBrowserInfo] = useState<InAppBrowserInfo | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hasDismissed, setHasDismissed] = useState(false)

  useEffect(() => {
    // Détection uniquement côté client
    const info = detectInAppBrowser()
    setBrowserInfo(info)

    // Vérifier si l'utilisateur a déjà fermé le popup durant cette session de navigation
    const dismissed = sessionStorage.getItem('df_iab_dismissed') === 'true'
    setHasDismissed(dismissed)

    if (info.isInApp && !dismissed) {
      // Léger délai d'apparition (400ms) pour une transition fluide et professionnelle
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [])

  if (!browserInfo?.isInApp) {
    return null
  }

  const handleDismiss = () => {
    setIsOpen(false)
    setHasDismissed(true)
    try {
      sessionStorage.setItem('df_iab_dismissed', 'true')
    } catch {}
  }

  const handleCopyLink = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)
      }
    } catch {
      // Fallback
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  const handleOpenExternal = () => {
    if (typeof window === 'undefined') return

    // Sur Android : Déclenchement de l'Intent Chrome direct
    if (browserInfo.isAndroid) {
      const cleanUrl = window.location.href.replace(/^https?:\/\//, '')
      const chromeIntent = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`
      window.location.href = chromeIntent
      return
    }

    // Sur iOS : Si le Web Share API est supporté, proposer le partage natif (qui offre "Ouvrir dans Safari")
    if (browserInfo.isIOS && navigator.share) {
      navigator
        .share({
          title: 'Dream Frame — Cadres 3D d\'Exception',
          url: window.location.href,
        })
        .catch(() => {
          handleCopyLink()
        })
      return
    }

    // Fallback standard : copier le lien
    handleCopyLink()
  }

  return (
    <>
      {/* ─── Flèche Indicatrice Visuelle en Haut à Droite (iOS Instagram / TikTok) ─── */}
      {isOpen && browserInfo.isIOS && (
        <div className="fixed top-2 right-3 z-[100001] pointer-events-none flex items-center gap-2 animate-bounce">
          <span className="text-[10px] font-bold font-mono tracking-wider bg-amber-400 text-black px-2.5 py-1 rounded-full shadow-lg">
            Touchez ici ••• pour Safari
          </span>
          <div className="w-8 h-8 rounded-full border-2 border-amber-400 bg-amber-400/20 flex items-center justify-center text-amber-300">
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
      )}

      {/* ─── Modal Pop-up Principal Haute Définition ─── */}
      {isOpen && (
        <div className="fixed inset-0 z-[100000] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          {/* Backdrop click to dismiss */}
          <div className="fixed inset-0" onClick={handleDismiss} />

          <div className="relative z-10 w-full max-w-lg bg-[#0E0E0C] border border-amber-400/30 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col p-6 sm:p-7 space-y-5 animate-zoom-in">
            {/* Halo lumineux d'ambiance or */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* En-tête : Badge Réseau Social & Bouton Fermer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                </span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                  Accès depuis {browserInfo.appName}
                </span>
              </div>

              <button
                type="button"
                onClick={handleDismiss}
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Titre Principal & Explication */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                Ouvrir dans un navigateur pour plus de rapidité
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                Le navigateur interne de <strong className="text-white font-semibold">{browserInfo.appName}</strong> ralentit l&apos;expérience 3D et bloque les options de paiement express.
              </p>
            </div>

            {/* Avantages pour la fluidité & conversion */}
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800/80">
                <div className="w-7 h-7 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Affichage 3D &amp; Vidéos 3× plus fluides</h3>
                  <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                    Profitez du rendu 60 FPS du cadre interactif sans saccades ni lenteurs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800/80">
                <div className="w-7 h-7 rounded-xl bg-emerald-400/10 border border-emerald-400/25 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Apple Pay &amp; Google Pay disponibles</h3>
                  <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                    Paiement sécurisé et instantané en 1 clic (souvent désactivé dans {browserInfo.appName}).
                  </p>
                </div>
              </div>
            </div>

            {/* Instruction Spécifique Plateforme */}
            <div className="p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>
                  {browserInfo.isIOS
                    ? 'Comment basculer sur Safari (iPhone / iPad) :'
                    : browserInfo.isAndroid
                    ? 'Comment basculer sur Google Chrome (Android) :'
                    : 'Comment ouvrir dans votre navigateur habituel :'}
                </span>
              </div>

              {browserInfo.isIOS ? (
                <ol className="text-xs text-neutral-300 space-y-1.5 list-decimal list-inside font-light">
                  <li>
                    Touchez les <strong className="text-white font-semibold">trois points •••</strong> en haut à droite (ou l&apos;icône Partager).
                  </li>
                  <li>
                    Appuyez sur <strong className="text-amber-300 font-semibold">« Ouvrir dans le navigateur externe »</strong> ou <strong className="text-amber-300 font-semibold">« Safari »</strong>.
                  </li>
                </ol>
              ) : browserInfo.isAndroid ? (
                <p className="text-xs text-neutral-300 font-light">
                  Appuyez sur le bouton ci-dessous pour lancer directement le site dans votre application <strong className="text-white font-semibold">Google Chrome</strong>.
                </p>
              ) : (
                <p className="text-xs text-neutral-300 font-light">
                  Ouvrez les options du menu et choisissez <strong className="text-white font-semibold">Ouvrir dans le navigateur</strong>.
                </p>
              )}
            </div>

            {/* Actions & Boutons CTA */}
            <div className="space-y-2.5 pt-1">
              {browserInfo.isAndroid ? (
                <button
                  type="button"
                  onClick={handleOpenExternal}
                  className="w-full py-3.5 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-amber-400/10 cursor-pointer active:scale-[0.98]"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Ouvrir directement dans Google Chrome</span>
                </button>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleOpenExternal}
                    className="py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-amber-400/10 cursor-pointer active:scale-[0.98]"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Basculer vers Safari</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="py-3 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.98]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Lien copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Copier le lien</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Lien secondaire pour continuer quand même */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-[11px] text-neutral-500 hover:text-neutral-300 transition underline underline-offset-4 cursor-pointer"
                >
                  Continuer quand même dans {browserInfo.appName}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Badge Flottant Discret si le pop-up a été fermé (Rappel Optionnel) ─── */}
      {!isOpen && hasDismissed && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          title="Ouvrir dans votre navigateur pour une vitesse maximale"
          className="fixed bottom-20 left-4 z-40 px-3 py-2 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-xl backdrop-blur-md transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
        >
          <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span>Ouvrir dans Safari / Chrome</span>
          <ArrowUpRight className="w-3 h-3 text-amber-400" />
        </button>
      )}
    </>
  )
}
