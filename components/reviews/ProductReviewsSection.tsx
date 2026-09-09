'use client'

import { useState } from 'react'
import { Star, CheckCircle, MessageSquarePlus, ThumbsUp } from 'lucide-react'
import { LeaveReviewModal } from './LeaveReviewModal'
import type { StoredReview } from '@/lib/data-store'

interface ProductReviewsSectionProps {
  productSlug: string
  productName: string
  productId?: string
  initialReviews: StoredReview[]
}

export function ProductReviewsSection({
  productSlug,
  productName,
  productId,
  initialReviews,
}: ProductReviewsSectionProps) {
  const [reviews, setReviews] = useState<StoredReview[]>(initialReviews)
  const [modalOpen, setModalOpen] = useState(false)

  // Calcul de la note moyenne
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0'

  const count5 = reviews.filter((r) => r.rating === 5).length
  const count4 = reviews.filter((r) => r.rating === 4).length
  const count3 = reviews.filter((r) => r.rating === 3).length

  return (
    <section className="mt-16 sm:mt-24 pt-12 border-t border-neutral-800 space-y-10">
      {/* ─── En-tête de la section Avis ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold">
              Expérience Propriétaires
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-xs text-neutral-400 font-mono">
              {reviews.length} Témoignage{reviews.length > 1 ? 's' : ''} Vérifié{reviews.length > 1 ? 's' : ''}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-white">
            Avis & Témoignages d'Atelier
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-xl">
            Découvrez l'effet produit par ce cadre en relief 3D une fois accroché ou posé chez les passionnés.
          </p>
        </div>

        {/* Bouton pour laisser un avis */}
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-amber-400/50 text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-lg cursor-pointer"
        >
          <MessageSquarePlus className="w-4 h-4 text-amber-400" />
          <span>Laisser mon avis d'atelier</span>
        </button>
      </div>

      {/* ─── Synthèse des Notes ─── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 sm:p-8 items-center">
        {/* Note Globale */}
        <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-neutral-800 pb-6 md:pb-0 md:pr-6 space-y-2">
          <div className="flex items-baseline justify-center md:justify-start gap-3">
            <span className="text-5xl font-serif font-bold text-white">{averageRating}</span>
            <span className="text-sm font-mono text-neutral-500">/ 5</span>
          </div>
          <div className="flex items-center justify-center md:justify-start text-amber-400 gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <p className="text-xs text-neutral-400 font-light">
            100% de recommandations positives par des passionnés certifiés
          </p>
        </div>

        {/* Distribution des étoiles */}
        <div className="md:col-span-8 space-y-2">
          {[
            { stars: 5, count: count5 },
            { stars: 4, count: count4 },
            { stars: 3, count: count3 },
          ].map(({ stars, count }) => {
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-neutral-400 font-mono text-[11px] flex items-center gap-1">
                  {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-neutral-500 font-mono text-[11px]">
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Grille des Cartes d'Avis ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between space-y-5 hover:border-neutral-700 transition duration-200"
          >
            <div className="space-y-3">
              {/* Étoiles & Date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-amber-400 gap-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-neutral-500">
                  {new Date(rev.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {/* Titre */}
              {rev.title && (
                <h3 className="font-serif font-bold text-sm text-white leading-snug">
                  {rev.title}
                </h3>
              )}

              {/* Commentaire */}
              <p className="text-xs text-neutral-300 font-light leading-relaxed italic">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>

            {/* Auteur & Format */}
            <div className="pt-4 border-t border-neutral-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-white text-xs">{rev.name}</p>
                  {rev.isVerified && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                {rev.formatPurchased && (
                  <span className="text-[9px] font-mono uppercase bg-neutral-800 text-amber-400/90 border border-neutral-700/60 px-2 py-0.5 rounded-md">
                    {rev.formatPurchased}
                  </span>
                )}
              </div>
              {rev.location && (
                <p className="text-[10px] text-neutral-500 font-mono">
                  {rev.location}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de dépôt d'avis */}
      <LeaveReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productSlug={productSlug}
        productId={productId}
        productName={productName}
        onSuccess={() => {
          // Recharger les avis ou actualiser la page
        }}
      />
    </section>
  )
}
