'use client'

import { useState, useEffect } from 'react'
import {
  Plug,
  Check,
  MessageCircle,
  BarChart3,
  CreditCard,
  Instagram,
  Tag,
  Key,
  Copy,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from 'lucide-react'
import {
  testAndSaveStripeKey,
  updateStripePricesAction,
  getStripeSettingsAction,
} from '@/app/(admin)/admin/parametres/actions'

export function IntegrationsPanel() {
  const [stripeExpanded, setStripeExpanded] = useState(true)
  const [stripeKeyInput, setStripeKeyInput] = useState('')
  const [testingStripe, setTestingStripe] = useState(false)
  const [stripeStatus, setStripeStatus] = useState<{
    configured: boolean
    livemode?: boolean
    currency?: string
    error?: string
  }>({ configured: false })

  const [priceA4, setPriceA4] = useState('')
  const [priceA3, setPriceA3] = useState('')
  const [priceA2, setPriceA2] = useState('')
  const [savingPrices, setSavingPrices] = useState(false)
  const [pricesMessage, setPricesMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [copiedWebhook, setCopiedWebhook] = useState(false)

  // Load existing settings on mount
  useEffect(() => {
    getStripeSettingsAction().then((res) => {
      setStripeStatus({ configured: res.hasStripeSecret })
      setPriceA4(res.priceA4)
      setPriceA3(res.priceA3)
      setPriceA2(res.priceA2)
    })
  }, [])

  const handleTestStripeKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripeKeyInput.trim()) return
    setTestingStripe(true)
    setStripeStatus((prev) => ({ ...prev, error: undefined }))

    const res = await testAndSaveStripeKey(stripeKeyInput)
    setTestingStripe(false)

    if (res.success) {
      setStripeStatus({
        configured: true,
        livemode: res.livemode,
        currency: res.currency,
      })
      setStripeKeyInput('')
    } else {
      setStripeStatus((prev) => ({
        ...prev,
        error: res.error || 'Clé API Stripe invalide',
      }))
    }
  }

  const handleSavePriceIds = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingPrices(true)
    setPricesMessage(null)

    const res = await updateStripePricesAction({
      priceA4,
      priceA3,
      priceA2,
    })
    setSavingPrices(false)

    if (res.success) {
      setPricesMessage({ type: 'success', text: 'Tarifs Stripe (Price IDs) associés avec succès !' })
      setTimeout(() => setPricesMessage(null), 4000)
    } else {
      setPricesMessage({ type: 'error', text: res.error || 'Erreur lors de la sauvegarde des identifiants' })
    }
  }

  const handleCopyWebhook = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://votre-site.vercel.app'
    const url = `${origin}/api/webhooks/stripe`
    navigator.clipboard.writeText(url)
    setCopiedWebhook(true)
    setTimeout(() => setCopiedWebhook(false), 2500)
  }

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Plug className="w-5 h-5 text-red-600" />
          Intégrations &amp; Paiements
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Gérez votre passerelle bancaire Stripe, vos tarifs par format et vos flux externes.
        </p>
      </div>

      {/* ─── 1. STRIPE FULL INTEGRATION CARD ─── */}
      <div className="bg-white border-2 border-red-100 rounded-2xl p-5 shadow-xs space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Paiements Sécurisés Stripe</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  stripeStatus.configured
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {stripeStatus.configured ? 'Opérationnel ✓' : 'Configuration requise'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Encaissement par Carte Bancaire, Apple Pay et Google Pay en direct sur votre compte.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStripeExpanded(!stripeExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition cursor-pointer"
          >
            {stripeExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {stripeExpanded && (
          <div className="space-y-5 pt-3 border-t border-slate-100">
            {/* 1. Clé secrète Stripe */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-red-600" />
                  Clé Secrète Stripe (Secret Key)
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Récupérez votre clé <code className="font-mono text-red-700">sk_live_...</code> (ou <code className="font-mono text-slate-700">sk_test_...</code>) sur votre compte Stripe.
                </p>
              </div>

              <form onSubmit={handleTestStripeKey} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="password"
                  value={stripeKeyInput}
                  onChange={(e) => setStripeKeyInput(e.target.value)}
                  placeholder="sk_live_... ou sk_test_..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <button
                  type="submit"
                  disabled={testingStripe || !stripeKeyInput.trim()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-2xs whitespace-nowrap"
                >
                  {testingStripe ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Test en cours...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Tester &amp; Activer
                    </>
                  )}
                </button>
              </form>

              {stripeStatus.error && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {stripeStatus.error}
                </div>
              )}
            </div>

            {/* 2. LE PANNEAU DEMANDÉ : Liaison des 3 Formats aux Tarifs Stripe */}
            <div className="p-4 bg-red-50/40 rounded-xl border border-red-200 space-y-3.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5 text-red-600" />
                    Liaison des Formats aux Produits Stripe (Price IDs)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Copiez l&apos;identifiant de tarif (<code className="font-mono text-red-700">price_...</code>) situé dans chaque produit de votre Catalogue Stripe.
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold whitespace-nowrap">
                  3 Formats Atelier
                </span>
              </div>

              <form onSubmit={handleSavePriceIds} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Format 1 */}
                  <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">Format 10×15cm</span>
                      <span className="font-mono font-bold text-red-600">49,90 €</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Standard A4 / Bureau</p>
                    <input
                      type="text"
                      value={priceA4}
                      onChange={(e) => setPriceA4(e.target.value)}
                      placeholder="price_1Q..."
                      className="w-full mt-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  {/* Format 2 */}
                  <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">Format 30×40cm</span>
                      <span className="font-mono font-bold text-red-600">149,90 €</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Grand Format A3 Collector</p>
                    <input
                      type="text"
                      value={priceA3}
                      onChange={(e) => setPriceA3(e.target.value)}
                      placeholder="price_1Q..."
                      className="w-full mt-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  {/* Format 3 */}
                  <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">Format 40×50cm</span>
                      <span className="font-mono font-bold text-red-600">249,90 €</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Prestige Galerie A2</p>
                    <input
                      type="text"
                      value={priceA2}
                      onChange={(e) => setPriceA2(e.target.value)}
                      placeholder="price_1Q..."
                      className="w-full mt-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    {pricesMessage && (
                      <span className={`text-xs font-bold ${
                        pricesMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {pricesMessage.text}
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={savingPrices}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-2xs"
                  >
                    {savingPrices ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5 text-red-500" />}
                    <span>Enregistrer les Price IDs</span>
                  </button>
                </div>
              </form>
            </div>

            {/* 3. URL Webhook & Événements */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                  URL Webhook Stripe (Validation automatique des commandes)
                </span>
                <button
                  type="button"
                  onClick={handleCopyWebhook}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedWebhook ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedWebhook ? 'Copié !' : 'Copier l&apos;URL'}</span>
                </button>
              </div>

              <code className="block p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-700 select-all">
                {typeof window !== 'undefined' ? `${window.location.origin}/api/webhooks/stripe` : 'https://votre-site/api/webhooks/stripe'}
              </code>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Collez cette URL dans Stripe (<strong>Développeurs &gt; Webhooks</strong>) et cochez les événements :
                <br />
                <code className="text-slate-700 font-mono text-[10px]">checkout.session.completed</code>,{' '}
                <code className="text-slate-700 font-mono text-[10px]">checkout.session.async_payment_succeeded</code>,{' '}
                <code className="text-slate-700 font-mono text-[10px]">checkout.session.async_payment_failed</code>,{' '}
                <code className="text-slate-700 font-mono text-[10px]">checkout.session.expired</code>,{' '}
                <code className="text-slate-700 font-mono text-[10px]">charge.refunded</code>,{' '}
                <code className="text-slate-700 font-mono text-[10px]">payment_intent.payment_failed</code>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ─── OTHER INTEGRATIONS ─── */}
      <div className="space-y-3">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
              <Instagram className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Flux Instagram Atelier</p>
              <p className="text-[11px] text-slate-500">Affichage automatique des dernières créations @dreamframe</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Connecté</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Google Analytics 4</p>
              <p className="text-[11px] text-slate-500">Mesure du trafic et suivi des conversions de vente</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Actif</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Support Client Direct</p>
              <p className="text-[11px] text-slate-500">Bouton de contact direct avec l&apos;Atelier</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold">Configuré</span>
        </div>
      </div>
    </div>
  )
}
