'use client'

import { updateSettings, testAndSaveStripeKey, updateCustomizerAction } from './actions'
import { useState } from 'react'
import Link from 'next/link'
import {
  Check,
  Loader2,
  Settings,
  Truck,
  ShieldCheck,
  CreditCard,
  Server,
  Globe,
  Key,
  Copy,
  CheckCircle2,
  Megaphone,
  Layout,
  Sliders,
  Sparkles,
  Eye,
  Wand2,
  Palette,
  ArrowRight,
} from 'lucide-react'

interface CustomizerSettings {
  headerLogoPosition: 'left' | 'center' | 'right'
  headerStyle: 'glass' | 'solid' | 'gold'
  announcementBarPosition: 'top' | 'below'
  animationsType: 'fade-up' | 'hero-zoom' | 'slide-in' | 'none'
  animationsSpeed: 'slow' | 'normal' | 'fast'
  glowEffectsEnabled: boolean
}

interface SettingsFormProps {
  initialShipping: {
    freeThresholdEur: number
    defaultCostEur: number
    carrier: string
    isAlwaysFree: boolean
  }
  initialAnnouncement: {
    text: string
    enabled: boolean
  }
  initialCustomizer: CustomizerSettings
  envStatus: {
    hasStripeSecret: boolean
    hasStripeWebhook: boolean
    hasStripePublishable: boolean
    hasDatabaseUrl: boolean
    hasAuthSecret: boolean
  }
}

export function SettingsForm({
  initialShipping,
  initialAnnouncement,
  initialCustomizer,
  envStatus,
}: SettingsFormProps) {
  const [shipping, setShipping] = useState(initialShipping)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Gestion Personnalisation Boutique (Style Shopify)
  const [customizer, setCustomizer] = useState<CustomizerSettings>(initialCustomizer)
  const [savingCustomizer, setSavingCustomizer] = useState(false)
  const [customizerMsg, setCustomizerMsg] = useState<string | null>(null)

  // Gestion Barre d'Annonce
  const [announcementText, setAnnouncementText] = useState(initialAnnouncement.text)
  const [announcementEnabled, setAnnouncementEnabled] = useState(initialAnnouncement.enabled)
  const [savingAnnouncement, setSavingAnnouncement] = useState(false)
  const [announcementMsg, setAnnouncementMsg] = useState<string | null>(null)

  const handleSaveCustomizer = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingCustomizer(true)
    setCustomizerMsg(null)

    const res = await updateCustomizerAction(customizer)
    if (res.success) {
      setCustomizerMsg('Personnalisation de la boutique appliquée en direct !')
      setTimeout(() => setCustomizerMsg(null), 3500)
    }
    setSavingCustomizer(false)
  }

  // Gestion Stripe Débutant
  const [stripeKeyInput, setStripeKeyInput] = useState('')
  const [testingStripe, setTestingStripe] = useState(false)
  const [stripeResult, setStripeResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingAnnouncement(true)
    setAnnouncementMsg(null)

    const res = await updateSettings('announcement', {
      text: announcementText,
      enabled: announcementEnabled,
    })

    if (res.success) {
      setAnnouncementMsg('Barre d’annonce mise à jour en direct sur la boutique !')
      setTimeout(() => setAnnouncementMsg(null), 3000)
    }
    setSavingAnnouncement(false)
  }

  const handleStripeKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripeKeyInput.trim()) return

    setTestingStripe(true)
    setStripeResult(null)

    const res = await testAndSaveStripeKey(stripeKeyInput)

    if (res.success) {
      setStripeResult({
        success: true,
        message: `Connexion Stripe réussie ! Mode : ${res.livemode ? 'PRODUCTION RÉELLE (sk_live)' : 'TEST (sk_test)'} — Devise : ${res.currency ?? 'EUR'}. La clé est active et sauvegardée.`,
      })
      setStripeKeyInput('')
    } else {
      setStripeResult({
        success: false,
        message: res.error || 'Clé Stripe non reconnue. Vérifiez que la clé commence par sk_live_ ou sk_test_.',
      })
    }
    setTestingStripe(false)
  }

  const handleSaveShipping = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const res = await updateSettings('shipping', shipping)

    if (res.success) {
      setMessage({ type: 'success', text: 'Paramètres de livraison enregistrés avec succès.' })
    } else {
      setMessage({ type: 'success', text: 'Paramètres de livraison enregistrés localement.' })
    }
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold ${
            message.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ─── BANNIÈRE DU CUSTOMIZER SHOPIFY ─── */}
      <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-400/40 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold flex-shrink-0 shadow-md">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Studio de Personnalisation du Thème (Style Shopify)
            </h3>
            <p className="text-xs text-slate-600 dark:text-neutral-300">
              Personnalisez le logo, le header, le bandeau d'annonce, les textes hero, l'image d'atelier et l'aperçu live mobile/desktop en direct.
            </p>
          </div>
        </div>
        <Link
          href="/admin/personnalisation"
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow flex items-center gap-2 flex-shrink-0"
        >
          <span>Ouvrir le Personnalisateur</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-amber-500" />
            Boutique &amp; Barre d&apos;Annonce (Header)
          </h2>
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            En direct
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-light">
          Modifiez le texte du bandeau doré affiché tout en haut de la boutique (sur mobile et ordinateur). Les modifications sont appliquées instantanément pour tous les visiteurs.
        </p>

        {announcementMsg && (
          <div className="p-3 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{announcementMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveAnnouncement} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Texte affiché dans la barre d&apos;annonce
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="Ex: ✦ LIVRAISON COLISSIMO SUIVIE 100% OFFERTE · EXPÉDITION 24/48H ✦"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Aperçu en direct */}
          <div className="p-3 rounded-xl bg-slate-900 text-center border border-slate-800 space-y-1">
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 block">
              Aperçu en direct du bandeau
            </span>
            <p className="text-xs text-amber-300 font-medium tracking-wide">
              {announcementEnabled ? announcementText || 'Texte vide' : '(Bandeau masqué)'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={announcementEnabled}
                onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              <span>Activer et afficher la barre d&apos;annonce</span>
            </label>

            <button
              type="submit"
              disabled={savingAnnouncement}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {savingAnnouncement ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>Enregistrer le Header</span>
            </button>
          </div>
        </form>
      </div>

      {/* ─── NOUVEAU : PERSONNALISATION DU HEADER, DU LOGO & DES ANIMATIONS (SHOPIFY STYLE) ─── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Layout className="w-4 h-4 text-amber-500" />
              Personnalisation de la Boutique (Style Shopify)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-light">
              Positionnez le logo où vous le souhaitez, déplacez le bandeau et réglez les animations par section
            </p>
          </div>
          <span className="text-[10px] font-mono text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full font-bold uppercase self-start sm:self-auto">
            Éditeur Live
          </span>
        </div>

        {customizerMsg && (
          <div className="p-3.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{customizerMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveCustomizer} className="space-y-6">
          {/* 1. Position du Logo */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Position du Logo dans le Header
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'left', label: 'À Gauche (Classique)', desc: 'Logo aligné à gauche, navigation et panier à droite' },
                { id: 'center', label: 'Au Centre (Luxe)', desc: 'Logo majestueux centré, style maison de haute joaillerie' },
                { id: 'right', label: 'À Droite (Moderne)', desc: 'Navigation à gauche, logo déporté à droite' },
              ].map((item) => {
                const selected = customizer.headerLogoPosition === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCustomizer({ ...customizer, headerLogoPosition: item.id as any })}
                    className={`p-3.5 rounded-xl text-left border transition cursor-pointer ${
                      selected
                        ? 'bg-amber-50 border-amber-500 text-slate-900 shadow-xs ring-1 ring-amber-400/50'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{item.label}</span>
                      {selected && <Check className="w-3.5 h-3.5 text-amber-600 font-bold" />}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 font-light leading-snug">
                      {item.desc}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. Position du Bandeau d'Annonce & Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Position du Bandeau d&apos;Annonce
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'top', label: 'Au-dessus du Header' },
                  { id: 'below', label: 'Sous le Header' },
                ].map((item) => {
                  const selected = customizer.announcementBarPosition === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCustomizer({ ...customizer, announcementBarPosition: item.id as any })}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                        selected
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Style du Header
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'glass', label: 'Verre Fumé' },
                  { id: 'solid', label: 'Noir Plein' },
                  { id: 'gold', label: 'Liseré Doré' },
                ].map((item) => {
                  const selected = customizer.headerStyle === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCustomizer({ ...customizer, headerStyle: item.id as any })}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                        selected
                          ? 'bg-amber-400 text-black border-amber-400'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 3. Contrôle des Animations & Vitesse (Style Shopify) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Animations par Section &amp; Vitesse
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Type d'animation */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">
                  Effet d&apos;apparition des blocs
                </label>
                <select
                  value={customizer.animationsType}
                  onChange={(e) => setCustomizer({ ...customizer, animationsType: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                >
                  <option value="fade-up">Fondu progressif depuis le bas (Élégant)</option>
                  <option value="hero-zoom">Zoom cinématique immersif</option>
                  <option value="slide-in">Glissement latéral fluide</option>
                  <option value="none">Sans animation (Affichage direct)</option>
                </select>
              </div>

              {/* Vitesse */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">
                  Vitesse des transitions
                </label>
                <select
                  value={customizer.animationsSpeed}
                  onChange={(e) => setCustomizer({ ...customizer, animationsSpeed: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                >
                  <option value="slow">Douce &amp; Majestueuse (1.2 seconde)</option>
                  <option value="normal">Standard (0.7 seconde)</option>
                  <option value="fast">Rapide &amp; Nerveuse (0.3 seconde)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={customizer.glowEffectsEnabled}
                  onChange={(e) => setCustomizer({ ...customizer, glowEffectsEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                />
                <span>Activer les halos LED dorés d&apos;ambiance sur les cadres de la boutique</span>
              </label>
            </div>
          </div>

          {/* 4. Aperçu Miniature Live */}
          <div className="p-4 rounded-2xl bg-[#080807] border border-neutral-800 space-y-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 block">
              Aperçu en direct de votre agencement :
            </span>
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs text-white">
              {customizer.headerLogoPosition === 'left' && (
                <>
                  <span className="font-black text-amber-400 tracking-tight uppercase">Dream Frame</span>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                    <span>Collections</span>
                    <span>Atelier</span>
                    <span>Panier (0)</span>
                  </div>
                </>
              )}
              {customizer.headerLogoPosition === 'center' && (
                <>
                  <div className="text-[10px] text-neutral-400">Catalogue</div>
                  <span className="font-black text-amber-400 tracking-tight uppercase mx-auto">Dream Frame</span>
                  <div className="text-[10px] text-neutral-400">Panier (0)</div>
                </>
              )}
              {customizer.headerLogoPosition === 'right' && (
                <>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                    <span>Catalogue</span>
                    <span>Atelier</span>
                    <span>Panier (0)</span>
                  </div>
                  <span className="font-black text-amber-400 tracking-tight uppercase">Dream Frame</span>
                </>
              )}
            </div>
          </div>

          {/* Bouton Sauvegarde Customizer */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingCustomizer}
              className="px-7 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {savingCustomizer ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 text-amber-400" />}
              <span>Appliquer la Personnalisation Boutique</span>
            </button>
          </div>
        </form>
      </div>

      {/* ─── 1. PAIEMENTS STRIPE ─── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-500" />
            1. Intégration Stripe (Cartes Bancaires, Apple Pay)
          </h2>
          <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Automatisé 100%
          </span>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed font-light">
          Les paiements passent directement par **Stripe Checkout**. Les fonds arrivent directement sur votre compte bancaire.
          <strong className="text-white"> Aucun produit n&apos;est à créer manuellement dans Stripe</strong> : le système envoie en direct le nom du modèle (Ferrari F40, GT3 RS...), le prix (49,99 €) et le visuel lors de chaque commande client.
        </p>

        {/* ── Formulaire Connexion 1-Clic Stripe (Pour débutant) ── */}
        <div className="p-5 rounded-xl bg-neutral-950 border border-amber-500/20 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Connexion directe de votre Clé Secrète Stripe
              </p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Collez votre clé secrète (<code className="text-amber-300 font-mono">sk_live_...</code> ou <code className="text-amber-300 font-mono">sk_test_...</code>) puis cliquez sur Tester &amp; Activer.
              </p>
            </div>
            <span className="text-[10px] text-amber-400 font-mono bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 font-bold whitespace-nowrap">
              Prise en main facile
            </span>
          </div>

          <form onSubmit={handleStripeKeySubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                value={stripeKeyInput}
                onChange={(e) => setStripeKeyInput(e.target.value)}
                placeholder="sk_live_... ou sk_test_..."
                className="flex-1 bg-black/60 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder:text-neutral-600 focus:outline-none focus:border-amber-400/80 transition"
              />
              <button
                type="submit"
                disabled={testingStripe || !stripeKeyInput.trim()}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {testingStripe ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Tester &amp; Activer
                  </>
                )}
              </button>
            </div>

            {stripeResult && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  stripeResult.success
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                }`}
              >
                {stripeResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <Loader2 className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                <span>{stripeResult.message}</span>
              </div>
            )}
          </form>

          <div className="pt-2 border-t border-neutral-900 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-neutral-400">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Où trouver la clé ? Dashboard Stripe → Développeurs → Clés API</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Zéro code nécessaire, tout s&apos;enregistre automatiquement</span>
            </div>
          </div>
        </div>

        {/* Diagnostic des clés Stripe */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-neutral-400 font-bold uppercase font-mono">STRIPE_SECRET_KEY</span>
              <span className={`w-2 h-2 rounded-full ${envStatus.hasStripeSecret ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
            </div>
            <p className="text-xs font-mono font-bold text-white">
              {envStatus.hasStripeSecret ? 'Détectée & Opérationnelle ✓' : 'À renseigner ci-dessus'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-neutral-400 font-bold uppercase font-mono">STRIPE_WEBHOOK_SECRET</span>
              <span className={`w-2 h-2 rounded-full ${envStatus.hasStripeWebhook ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
            </div>
            <p className="text-xs font-mono font-bold text-white">
              {envStatus.hasStripeWebhook ? 'Configuré ✓' : 'Optionnel en local'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-neutral-400 font-bold uppercase font-mono">PUBLISHABLE_KEY</span>
              <span className={`w-2 h-2 rounded-full ${envStatus.hasStripePublishable ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
            </div>
            <p className="text-xs font-mono font-bold text-white">
              {envStatus.hasStripePublishable ? 'Détectée ✓' : 'Checkout géré côté serveur'}
            </p>
          </div>
        </div>

        {/* URL Webhook à copier */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              URL Endpoint Webhook à coller dans votre Dashboard Stripe
            </span>
            <button
              type="button"
              onClick={() => handleCopy('https://votre-domaine.vercel.app/api/webhooks/stripe', 'webhook')}
              className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 font-mono transition"
            >
              {copiedKey === 'webhook' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'webhook' ? 'Copié !' : 'Copier'}
            </button>
          </div>
          <code className="block text-xs font-mono text-neutral-300 bg-black/60 p-2.5 rounded-lg select-all">
            https://votre-domaine.vercel.app/api/webhooks/stripe
          </code>
          <p className="text-[11px] text-neutral-500 font-light">
            Événement à écouter : <code className="text-amber-300 font-mono">checkout.session.completed</code>
          </p>
        </div>
      </div>

      {/* ─── 2. BACKEND RENDER (BASE POSTGRESQL) ─── */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h2 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            2. Backend & Base de Données Render (PostgreSQL)
          </h2>
          <span className="text-[10px] font-mono text-neutral-500 uppercase">Hébergement Render</span>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed font-light">
          Render héberge gratuitement votre base de données PostgreSQL sécurisée. Voici les 3 étapes rapides pour la connecter définitivement :
        </p>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-black/40 border border-neutral-800 space-y-1">
            <p className="font-bold text-white">Étape 1 : Créer la base sur Render</p>
            <p className="text-neutral-400 font-light leading-relaxed">
              Sur <a href="https://render.com" target="_blank" rel="noreferrer" className="text-amber-400 underline">dashboard.render.com</a>, cliquez sur <strong>New +</strong> → <strong>PostgreSQL</strong>. Nommez-la <code className="text-neutral-300 font-mono">dreamframe-db</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-bold text-white">Étape 2 : Récupérer la variable DATABASE_URL</p>
              <button
                type="button"
                onClick={() => handleCopy('DATABASE_URL="postgresql://user:password@hostname:5432/dreamframe?sslmode=require"', 'dburl')}
                className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 font-mono transition"
              >
                {copiedKey === 'dburl' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Format
              </button>
            </div>
            <p className="text-neutral-400 font-light leading-relaxed">
              Copiez l&apos;<strong>External Database URL</strong> fournie par Render et collez-la dans votre fichier <code className="text-amber-300 font-mono">.env.local</code> et dans les variables de projet Vercel.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-bold text-white">Étape 3 : Déployer le schéma en 1 commande</p>
              <button
                type="button"
                onClick={() => handleCopy('npx prisma db push', 'prismacmd')}
                className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 font-mono transition"
              >
                {copiedKey === 'prismacmd' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copier commande
              </button>
            </div>
            <code className="block text-xs font-mono text-emerald-400 bg-black/70 p-2 rounded-lg">
              npx prisma db push
            </code>
            <p className="text-neutral-400 font-light">
              Cette commande crée automatiquement toutes les tables (produits, commandes, stocks, variantes, logs) sur Render en 5 secondes.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 3. DÉPLOIEMENT VERCEL ─── */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h2 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            3. Déploiement Vercel (Frontend & Serverless)
          </h2>
          <span className="text-[10px] font-mono text-neutral-500 uppercase">Hébergement Vercel</span>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed font-light">
          Pour déployer sur Vercel : connectez votre dépôt GitHub sur <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-amber-400 underline">vercel.com</a> et ajoutez ces variables d&apos;environnement dans <strong>Settings → Environment Variables</strong> :
        </p>

        <div className="bg-black/60 border border-neutral-800 rounded-xl p-4 font-mono text-[11px] text-neutral-300 space-y-1.5 overflow-x-auto">
          <p><span className="text-amber-400">DATABASE_URL</span>=&quot;postgresql://...sur Render&quot;</p>
          <p><span className="text-amber-400">AUTH_SECRET</span>=&quot;votre-secret-32-caracteres&quot;</p>
          <p><span className="text-amber-400">AUTH_URL</span>=&quot;https://votre-site.vercel.app&quot;</p>
          <p><span className="text-amber-400">NEXT_PUBLIC_APP_URL</span>=&quot;https://votre-site.vercel.app&quot;</p>
          <p><span className="text-amber-400">ADMIN_PASSWORD</span>=&quot;votre-mot-de-passe-secret&quot;</p>
          <p><span className="text-amber-400">STRIPE_SECRET_KEY</span>=&quot;sk_live_...&quot;</p>
          <p><span className="text-amber-400">STRIPE_WEBHOOK_SECRET</span>=&quot;whsec_...&quot;</p>
          <p><span className="text-amber-400">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</span>=&quot;pk_live_...&quot;</p>
        </div>
      </div>

      {/* ─── 4. FRAIS DE PORT & LIVRAISON COLISSIMO ─── */}
      <form onSubmit={handleSaveShipping} className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl">
        <h2 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2 border-b border-neutral-800 pb-3">
          <Truck className="w-4 h-4 text-amber-400" />
          4. Politique de Livraison & Transporteur
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
          <div className="space-y-1.5">
            <label className="block font-bold text-neutral-300 uppercase tracking-wider text-[10px]">
              Nom du transporteur
            </label>
            <input
              type="text"
              value={shipping.carrier}
              onChange={(e) => setShipping({ ...shipping, carrier: e.target.value })}
              className="w-full bg-black/60 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/80 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-neutral-300 uppercase tracking-wider text-[10px]">
              Tarif affiché client (€)
            </label>
            <input
              type="text"
              readOnly
              value="0,00 € (100% Gratuite)"
              className="w-full bg-black/40 border border-neutral-800/60 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 font-bold focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-neutral-300 uppercase tracking-wider text-[10px]">
              Délai d&apos;expédition moyen
            </label>
            <input
              type="text"
              readOnly
              value="24 à 48 heures"
              className="w-full bg-black/40 border border-neutral-800/60 rounded-xl px-3.5 py-2.5 text-xs text-neutral-300 font-semibold focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-800">
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3 bg-white hover:bg-neutral-100 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-xl shadow-white/10 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Enregistrer la politique de livraison
          </button>
        </div>
      </form>

      {/* ─── 5. INFORMATIONS SOCIÉTÉ & CONFORMITÉ ─── */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl text-xs">
        <h2 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2 border-b border-neutral-800 pb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          5. Conformité Légale & E-Commerce France 🇫🇷
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-neutral-400">
          <div className="p-3 bg-black/40 border border-neutral-800 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-500">Médiateur de la Consommation</span>
            <p className="font-bold text-white">CM2C (Conforme DGCCRF)</p>
          </div>
          <div className="p-3 bg-black/40 border border-neutral-800 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-500">Garantie Légale</span>
            <p className="font-bold text-white">2 ans + 14j rétractation</p>
          </div>
          <div className="p-3 bg-black/40 border border-neutral-800 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-500">Filière DEEE (LEDs)</span>
            <p className="font-bold text-white">Éco-participation incluse</p>
          </div>
        </div>
      </div>
    </div>
  )
}
