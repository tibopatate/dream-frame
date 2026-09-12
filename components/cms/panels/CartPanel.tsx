'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, Sparkles, Check, Loader2, Package, Shield, Gift } from 'lucide-react'

export function CartPanel() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [cartUpsellsEnabled, setCartUpsellsEnabled] = useState(false)
  const [cartUpsellChevaletEnabled, setCartUpsellChevaletEnabled] = useState(false)
  const [cartUpsellMicrofibreEnabled, setCartUpsellMicrofibreEnabled] = useState(false)
  const [cartUpsellGiftEnabled, setCartUpsellGiftEnabled] = useState(false)

  useEffect(() => {
    fetch('/api/settings/cart')
      .then((res) => res.json())
      .then((data) => {
        setCartUpsellsEnabled(Boolean(data.cartUpsellsEnabled))
        setCartUpsellChevaletEnabled(Boolean(data.cartUpsellChevaletEnabled))
        setCartUpsellMicrofibreEnabled(Boolean(data.cartUpsellMicrofibreEnabled))
        setCartUpsellGiftEnabled(Boolean(data.cartUpsellGiftEnabled))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async (updates: {
    cartUpsellsEnabled?: boolean
    cartUpsellChevaletEnabled?: boolean
    cartUpsellMicrofibreEnabled?: boolean
    cartUpsellGiftEnabled?: boolean
  }) => {
    const nextState = {
      cartUpsellsEnabled: updates.cartUpsellsEnabled ?? cartUpsellsEnabled,
      cartUpsellChevaletEnabled: updates.cartUpsellChevaletEnabled ?? cartUpsellChevaletEnabled,
      cartUpsellMicrofibreEnabled: updates.cartUpsellMicrofibreEnabled ?? cartUpsellMicrofibreEnabled,
      cartUpsellGiftEnabled: updates.cartUpsellGiftEnabled ?? cartUpsellGiftEnabled,
    }

    if (updates.cartUpsellsEnabled !== undefined) setCartUpsellsEnabled(updates.cartUpsellsEnabled)
    if (updates.cartUpsellChevaletEnabled !== undefined) setCartUpsellChevaletEnabled(updates.cartUpsellChevaletEnabled)
    if (updates.cartUpsellMicrofibreEnabled !== undefined) setCartUpsellMicrofibreEnabled(updates.cartUpsellMicrofibreEnabled)
    if (updates.cartUpsellGiftEnabled !== undefined) setCartUpsellGiftEnabled(updates.cartUpsellGiftEnabled)

    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/settings/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextState),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="w-5 h-5 animate-spin text-red-600" />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-600" />
            Panier &amp; Compléments (Upsells)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Activez ou désactivez les ventes complémentaires proposées aux acheteurs sur la page panier.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          {saving ? (
            <span className="text-slate-400 flex items-center gap-1 font-mono text-[10px]">
              <Loader2 className="w-3 h-3 animate-spin text-red-600" />
              Sauvegarde...
            </span>
          ) : saved ? (
            <span className="text-emerald-600 flex items-center gap-1 font-semibold text-[10px]">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Enregistré
            </span>
          ) : null}
        </div>
      </div>

      {/* ─── Interrupteur Général des Upsells ─── */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800">
              Afficher les Upsells sur la page Panier
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Si désactivé, aucun produit complémentaire n&apos;apparaîtra aux clients.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleSave({ cartUpsellsEnabled: !cartUpsellsEnabled })}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
              cartUpsellsEnabled ? 'bg-red-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                cartUpsellsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
          <span className={`w-2 h-2 rounded-full ${cartUpsellsEnabled ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span>Statut actuel : <strong>{cartUpsellsEnabled ? 'Upsells Activés' : 'Désactivés (Masqués)'}</strong></span>
        </div>
      </div>

      {/* ─── Contrôle Individuel par Upsell ─── */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Gestion Individuelle des Compléments
        </h3>

        {/* 1. Chevalet de Table Alu */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Chevalet de Table Aluminium Noir Mat</p>
                <p className="text-[11px] text-slate-500">Tarif : 14,90 € TTC · Exposition sur meuble ou bureau</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleSave({ cartUpsellChevaletEnabled: !cartUpsellChevaletEnabled })}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                cartUpsellChevaletEnabled ? 'bg-red-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  cartUpsellChevaletEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 2. Chiffonnette Microfibre */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Chiffonnette Optique Microfibre Atelier</p>
                <p className="text-[11px] text-slate-500">Tarif : 4,90 € TTC · Entretien vitrage acrylique sans rayure</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleSave({ cartUpsellMicrofibreEnabled: !cartUpsellMicrofibreEnabled })}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                cartUpsellMicrofibreEnabled ? 'bg-red-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  cartUpsellMicrofibreEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 3. Option Emballage Cadeau */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Option Emballage Cadeau Luxe</p>
                <p className="text-[11px] text-slate-500">Tarif : +4,90 € · Papier de soie, ruban noir &amp; mot manuscrit</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleSave({ cartUpsellGiftEnabled: !cartUpsellGiftEnabled })}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                cartUpsellGiftEnabled ? 'bg-red-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  cartUpsellGiftEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
