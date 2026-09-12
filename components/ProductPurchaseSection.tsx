'use client'

import { useState } from 'react'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { Truck, RotateCcw, ShieldCheck, Zap, Sparkles, CheckCircle2, Award } from 'lucide-react'
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

const FALLBACK_FORMATS: ProductFormat[] = [
  {
    id: 'fmt-a4',
    name: 'Standard A4',
    size: '21 × 29.7 cm',
    price: 49.90,
    stock: 25,
    isDefault: true,
  },
  {
    id: 'fmt-a3',
    name: 'Grand Format A3 Collector',
    size: '30 × 42 cm',
    price: 149.90,
    stock: 10,
    isDefault: false,
  },
  {
    id: 'fmt-a2',
    name: 'Prestige Galerie A2',
    size: '50 × 70 cm',
    price: 249.90,
    stock: 5,
    isDefault: false,
  },
]

export function ProductPurchaseSection({ product }: ProductPurchaseSectionProps) {
  const price = Number(product.price) || 49.90
  const stock = product.stock ?? 10
  const [quantity, setQuantity] = useState(1)

  // Format unique et dédié à chaque cadre (non sélectionnable côté client)
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
      ? "Miniature 1:18 Grand Format d'exposition sous vitrine"
      : price >= 100
      ? "Miniature 1:18 en relief sous vitrine d'artisanat"
      : "Miniature 1:24 en relief sous vitrage acrylique HD"

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Bloc Tarif, Format Unique & Panier */}
      <div className="bg-neutral-900/90 border border-neutral-800/90 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-xl">
        {/* ─── Mise en Avant du Stock Produit (Prominent Luxury Stock Indicator) ─── */}
        <div>
          {stock <= 3 ? (
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center justify-between shadow-lg shadow-amber-500/5">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                </span>
                <div>
                  <p className="text-xs font-mono font-bold tracking-wider uppercase text-amber-300">
                    Stock Critique · Plus que {stock} exemplaire{stock > 1 ? 's' : ''} en atelier
                  </p>
                  <p className="text-[10px] text-amber-400/80 font-light">
                    Forte demande · Confection et certificat numéroté inclus
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 border border-amber-500/40 text-amber-400 uppercase font-bold">
                {stock} DISPO
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between shadow-lg shadow-emerald-500/5">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <div>
                  <p className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-300">
                    En stock atelier : {stock} exemplaires confectionnés
                  </p>
                  <p className="text-[10px] text-emerald-400/80 font-light">
                    Prêt pour expédition express sous 24/48h
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 border border-emerald-500/30 text-emerald-400 uppercase font-bold">
                EN STOCK
              </span>
            </div>
          )}
        </div>

        {/* Prix dynamique et Livraison */}
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div>
            <span className="text-3xl sm:text-4xl font-bold text-white transition-all">
              {price.toFixed(2).replace('.', ',')} €
            </span>
            <span className="text-neutral-400 text-xs font-sans pl-2">TTC</span>
            {price >= 200 ? (
              <span className="ml-2.5 inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Édition Grand Format
              </span>
            ) : price >= 100 ? (
              <span className="ml-2.5 inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Format Moyen Collector
              </span>
            ) : null}
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            Livraison 100% Offerte
          </span>
        </div>

        {/* ─── Format d'Art Unique Certifié (Non modifiable côté client) ─── */}
        <div className="space-y-3 pt-2">
          <div className="p-4 bg-black/60 border border-neutral-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Format d'Art Unique Certifié
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                Pièce Exclusive Atelier
              </span>
            </div>
            <div className="pt-1">
              <p className="text-sm font-bold text-white">{formatName}</p>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Dimensions réelles : <strong className="text-neutral-200 font-medium">{formatSize}</strong> · {formatScale}
              </p>
            </div>
          </div>

          {/* Sélecteur de Quantité */}
          <div className="flex items-center justify-between p-3.5 bg-black/40 border border-neutral-800 rounded-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-semibold">
              Quantité
            </span>
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded flex items-center justify-center hover:bg-neutral-800 text-neutral-300 hover:text-white transition cursor-pointer text-sm font-bold"
                title="Diminuer la quantité"
              >
                −
              </button>
              <span className="w-8 text-center text-xs font-mono font-bold text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                className="w-8 h-8 rounded flex items-center justify-center hover:bg-neutral-800 text-neutral-300 hover:text-white transition cursor-pointer text-sm font-bold"
                title="Augmenter la quantité"
              >
                +
              </button>
            </div>
          </div>

          {/* Indicateur de disponibilité atelier */}
          <div className="flex items-center justify-between text-[11px] pt-1 px-1">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>En stock ({stock} pièces disponibles) · Prêt à expédier</span>
            </span>
            <span className="text-neutral-500 font-mono text-[10px]">
              Expédition 24/48h
            </span>
          </div>
        </div>

        {/* Bouton Ajouter au Panier avec Prix et Quantité */}
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

        {/* Réassurance d'Atelier sous le CTA */}
        <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-neutral-800 text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>✓ Livraison suivie 48h</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>✓ Paiement 100% sécurisé</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>✓ Garantie atelier 2 ans</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>✓ Fait Main en France</span>
          </div>
        </div>

        {/* Mention DEEE */}
        <div className="pt-3 border-t border-neutral-800/60 text-[10px] text-neutral-400 leading-relaxed font-light">
          Ce cadre d'art intègre un système d'éclairage électrique basse consommation. L'éco-participation DEEE est comprise dans le tarif.
        </div>
      </div>

      {/* Caractéristiques d'Atelier adaptées au Format */}
      <div className="space-y-3 border-t border-neutral-800 pt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">Spécifications du format d'art</h2>
          <span className="text-xs font-mono text-amber-400">{formatName}</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          {[
            ['Dimensions', formatSize],
            ['Miniature', formatScale],
            ['Châssis', 'Ébénisterie Noir Profond Atelier'],
            ['Vitrage', 'Verre acrylique HD anti-rayures & anti-poussière'],
            ['Éclairage', 'Micro-LEDs ambrées intégrées + variateur'],
            ['Atelier', 'Fait main et certifié en France'],
          ].map(([label, value]) => (
            <div key={label} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
              <p className="text-neutral-400 text-[10px] uppercase font-mono">{label}</p>
              <p className="text-white font-medium mt-0.5 text-xs">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
