'use client'

import { useState } from 'react'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { Truck, ShieldCheck, Award, Sparkles } from 'lucide-react'
import { isVideoUrl } from '@/lib/utils'
import type { ProductFormat } from '@/lib/data-store'

interface ProductPurchaseSectionProps {
  product: {
    id: string
    name: string
    brand: string
    slug: string
    images: string[]
    description?: string
    price: number
    sku?: string
    stock?: number
    formatName?: string
    formatSize?: string
    formats?: ProductFormat[]
  }
}

export function ProductPurchaseSection({ product }: ProductPurchaseSectionProps) {
  const price = Number(product.price) || 49.90
  const stock = product.stock ?? 10
  const [quantity, setQuantity] = useState(1)

  // Format unique et dédié à chaque cadre (verrouillé pour correspondre au gabarit d'atelier)
  const formatName =
    product.formatName ||
    (price >= 200
      ? 'Grand Cadre Prestige'
      : price >= 100
      ? 'Cadre Moyen Collector'
      : 'Petit Cadre Standard')

  const formatSize =
    product.formatSize ||
    (price >= 200
      ? '50 × 70 cm'
      : price >= 100
      ? '30 × 42 cm'
      : '21 × 29.7 cm')

  const formatScale =
    price >= 200
      ? 'Échelle 1:18 Grand Format'
      : price >= 100
      ? 'Échelle 1:18 Atelier'
      : 'Échelle 1:24 Atelier'

  return (
    <div className="space-y-6">
      {/* ─── Fiche d'Achat Atelier Épurée & Minimaliste ─── */}
      <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 sm:p-7 space-y-6">
        
        {/* Prix & Disponibilité discrète de haute horlogerie / maroquinerie */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {stock <= 3 ? (
              <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                </span>
                <span>Plus que {stock} exemplaire{stock > 1 ? 's' : ''} disponible{stock > 1 ? 's' : ''}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>En stock atelier · Prêt pour expédition</span>
              </div>
            )}

            <span className="text-[11px] text-neutral-400 font-mono">
              Fait main en France
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono">
                {price.toFixed(2).replace('.', ',')} €
              </span>
              <span className="text-neutral-400 text-xs font-light">TTC</span>
            </div>

            <span className="text-xs text-neutral-300 font-light flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-neutral-400" />
              Livraison offerte
            </span>
          </div>
        </div>

        {/* Ligne Format & Dimensions sobre */}
        <div className="py-3 px-4 rounded-xl bg-neutral-950/60 border border-neutral-800/60 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">
              Format d'Art
            </span>
            <span className="text-white font-medium">
              {formatName} <span className="text-neutral-400 font-normal">({formatSize})</span>
            </span>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            {formatScale}
          </span>
        </div>

        {/* Quantité & Bouton Ajouter au Panier */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {/* Sélecteur de Quantité Minimaliste */}
            <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-1 shrink-0 h-12">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-full rounded-lg flex items-center justify-center text-neutral-400 hover:text-white transition text-sm font-medium cursor-pointer"
                aria-label="Diminuer la quantité"
              >
                −
              </button>
              <span className="w-8 text-center text-xs font-mono font-medium text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                className="w-8 h-full rounded-lg flex items-center justify-center text-neutral-400 hover:text-white transition text-sm font-medium cursor-pointer"
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>

            {/* Bouton d'Achat Principal */}
            <div className="flex-1">
              <AddToCartButton
                variantId={`${product.id}-unique`}
                productId={product.id}
                productName={product.name}
                slug={product.slug}
                brand={product.brand}
                image={product.images?.find((img: string) => !isVideoUrl(img)) || product.images?.[0] || ''}
                price={price}
                stock={stock}
                formatName={formatName}
                formatSize={formatSize}
                quantity={quantity}
              />
            </div>
          </div>

          {/* Réassurance Atelier Épurée (Une seule ligne chic) */}
          <div className="pt-3 border-t border-neutral-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400 font-light">
            <span className="flex items-center gap-1.5">
              <span className="text-amber-400 text-xs">✓</span> Confection artisanale
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400 text-xs">✓</span> Expédition sous 24/48h
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-neutral-300 text-xs">✓</span> Garantie atelier 2 ans
            </span>
          </div>
        </div>
      </div>

      {/* ─── Spécifications Techniques Minimalistes ─── */}
      <div className="space-y-3 pt-2">
        <h2 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
          Détails de confection
        </h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            ['Format & Dimensions', formatSize],
            ['Reproduction', formatScale],
            ['Châssis', 'Ébénisterie Noir Profond'],
            ['Protection', 'Vitrage HD anti-reflet'],
            ['Éclairage', 'Système LED ambré intégré'],
            ['Origine', 'Atelier français certifié'],
          ].map(([label, value]) => (
            <div key={label} className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-3">
              <p className="text-neutral-500 text-[10px] uppercase font-mono">{label}</p>
              <p className="text-neutral-200 font-medium mt-0.5 text-xs">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
