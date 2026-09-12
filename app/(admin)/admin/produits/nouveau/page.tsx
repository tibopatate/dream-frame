'use client'

import { createProduct, syncProductToStripe } from '../actions'
import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Loader2,
  Plus,
  Trash,
  Sparkles,
  Layers,
  CreditCard,
  CheckCircle2,
  HelpCircle,
  Crop,
} from 'lucide-react'
import { ImageCropper, CropSettings } from '@/components/admin/ImageCropper'
import { ProductImageUploader } from '@/components/admin/ProductImageUploader'

interface FormatItem {
  id: string
  name: string
  size: string
  price: number
  stock: number
  isDefault: boolean
}

export default function NouveauProduitPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stripeStatus, setStripeStatus] = useState<string | null>(null)

  // Gérer la liste des URLs d'images
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [images, setImages] = useState<string[]>([])

  // Studio de Recadrage & Aspect Ratio
  const [cropSettings, setCropSettings] = useState<CropSettings>({
    aspectRatio: '4:3',
    zoom: 1.0,
    panX: 0,
    panY: 0,
  })
  const [showCropper, setShowCropper] = useState(false)

  // 3 Formats de Cadres (Standard 49,99€, Grand 150€, Prestige 250€)
  const [formats, setFormats] = useState<FormatItem[]>([
    {
      id: 'fmt-a4',
      name: 'Standard A4',
      size: '21 x 29.7 cm',
      price: 49.90,
      stock: 10,
      isDefault: true,
    },
    {
      id: 'fmt-a3',
      name: 'Grand Format A3 Collector',
      size: '30 x 42 cm',
      price: 149.90,
      stock: 5,
      isDefault: false,
    },
    {
      id: 'fmt-a2',
      name: 'Prestige Galerie A2',
      size: '50 x 70 cm',
      price: 249.90,
      stock: 2,
      isDefault: false,
    },
  ])

  const [syncWithStripe, setSyncWithStripe] = useState(true)

  const addImage = () => {
    if (imageUrlInput.trim()) {
      setImages([...images, imageUrlInput.trim()])
      setImageUrlInput('')
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const updateFormat = (id: string, field: 'price' | 'stock', value: number) => {
    setFormats(
      formats.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (images.length === 0) {
      setError('Au moins une image est requise.')
      return
    }

    setLoading(true)
    setError(null)
    setStripeStatus(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    // Injection des métadonnées de formats & cadrage
    formData.set('formatsData', JSON.stringify(formats))
    formData.set('aspectRatio', cropSettings.aspectRatio)
    formData.set('cropPosition', JSON.stringify({
      x: cropSettings.panX,
      y: cropSettings.panY,
      zoom: cropSettings.zoom,
    }))
    formData.set('price', formats[0].price.toString())
    formData.set('stock', formats.reduce((s, f) => s + f.stock, 0).toString())

    try {
      // Synchronisation Stripe si demandée
      if (syncWithStripe) {
        const stripeRes = await syncProductToStripe({
          name: formData.get('name') as string,
          description: formData.get('description') as string,
          images,
          formats,
        })
        if (stripeRes.message) {
          setStripeStatus(stripeRes.message)
        }
      }

      const res = await createProduct(images, formData)
      if (res?.error) {
        setError(res.error)
        setLoading(false)
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la création')
      setLoading(false)
    }
  }

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
      <Link
        href="/admin/produits"
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Retour au catalogue
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
          Ajouter un Cadre 3D
        </h1>
        <p className="text-neutral-400 text-xs mt-1">
          Configurez les 3 formats (49,99 €, 150 € et 250 €), recadrez vos visuels et synchronisez avec Stripe en 1 clic
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-bold">
            ⚠️ {error}
          </div>
        )}

        {stripeStatus && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{stripeStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Nom */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Nom du modèle
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Ex: Ferrari F40 (1987) — Cadre 3D"
              className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400/80 transition"
            />
          </div>

          {/* Marque */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Marque
            </label>
            <input
              type="text"
              name="brand"
              required
              placeholder="Ex: Ferrari, Porsche, Lamborghini..."
              className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400/80 transition"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
            Description artistique &amp; technique
          </label>
          <textarea
            name="description"
            required
            rows={3}
            placeholder="Miniature en relief 3D, passe-partout biseauté noir profond, bandeau micro-LED rétroéclairé..."
            className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400/80 transition leading-relaxed"
          />
        </div>

        {/* ─── NOUVEAUX GRANDS CADRES : LES 3 FORMATS & TARIFS ─── */}
        <div className="border-t border-neutral-800 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Formats du Cadre &amp; Tarifs Vendeur (Standard, 150 € et 250 €)
              </label>
              <p className="text-[11px] text-neutral-400">
                Chaque format dispose de son prix et de son stock propre. Votre frère peut adapter les tarifs librement.
              </p>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
              3 formats actifs
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {formats.map((fmt) => (
              <div
                key={fmt.id}
                className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{fmt.name}</h4>
                    <p className="text-[10px] font-mono text-neutral-500">{fmt.size}</p>
                  </div>
                  {fmt.isDefault && (
                    <span className="text-[9px] font-mono uppercase bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                      Base
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase font-bold block mb-1">
                      Prix Vente (€ TTC)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      value={fmt.price}
                      onChange={(e) => updateFormat(fmt.id, 'price', parseFloat(e.target.value) || 0)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase font-bold block mb-1">
                      Stock Disponible
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={fmt.stock}
                      onChange={(e) => updateFormat(fmt.id, 'stock', parseInt(e.target.value) || 0)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── SECTION IMAGES & STUDIO DE RECADRAGE ─── */}
        <div className="border-t border-neutral-800 pt-6 space-y-4">
          <ProductImageUploader
            images={images}
            onChange={(newImages) => setImages(newImages)}
          />

          {images.length > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowCropper(!showCropper)}
                className="px-3.5 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
              >
                <Crop className="w-3.5 h-3.5" />
                <span>{showCropper ? 'Fermer le studio de recadrage' : 'Ajuster le cadrage 3D de l’image principale'}</span>
              </button>

              {showCropper && (
                <div className="mt-3">
                  <ImageCropper
                    imageUrl={images[0]}
                    initialSettings={cropSettings}
                    onChange={(newSettings) => setCropSettings(newSettings)}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── SYNCHRONISATION STRIPE EN 1 CLIC ─── */}
        <div className="border-t border-neutral-800 pt-6 space-y-3">
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0 mt-0.5">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <label className="text-xs font-bold text-white flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={syncWithStripe}
                    onChange={(e) => setSyncWithStripe(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-purple-500 focus:ring-purple-400"
                  />
                  <span>Créer et synchroniser automatiquement ce produit sur Stripe</span>
                </label>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Crée la fiche produit et les 3 prix (49,99 €, 150 € et 250 €) directement sur votre compte Stripe. Zéro démarche technique.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'Action */}
        <div className="border-t border-neutral-800 pt-6 flex justify-end gap-3">
          <Link
            href="/admin/produits"
            className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-xl text-xs uppercase tracking-wider transition"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-white hover:bg-neutral-100 text-black font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-xl shadow-white/10 flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enregistrement &amp; Synchronisation...
              </>
            ) : (
              'Enregistrer et Publier le Cadre'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

