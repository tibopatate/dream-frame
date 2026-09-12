'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, CheckCircle, Quote, ThumbsUp, Heart, MessageSquarePlus } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { LeaveReviewModal } from '@/components/reviews/LeaveReviewModal'

const REVIEWS = [
  {
    id: 1,
    name: 'Julien M.',
    location: 'Bordeaux',
    verified: true,
    model: 'Porsche 911 GT3 RS',
    rating: 5,
    date: 'Il y a 3 jours',
    comment:
      "Installé dans mon bureau à côté de mon setup. Le rétroéclairage LED de la GT3 RS le soir est juste bluffant. Tous mes collègues en visio me demandent où je l'ai trouvé.",
    interior: "Bureau d'architecte & Setup",
  },
  {
    id: 2,
    name: 'Alexandre D.',
    location: 'Lyon',
    verified: true,
    model: 'Ferrari F40 (1987)',
    rating: 5,
    date: 'Il y a 1 semaine',
    comment:
      "J'ai pris la F40 pour mon salon contemporain. Le relief 3D et le passe-partout biseauté ont un niveau de finition digne d'une vraie galerie d'art. Emballage ultra blindé.",
    interior: 'Salon Contemporain',
  },
  {
    id: 3,
    name: 'Romain B.',
    location: 'Genève',
    verified: true,
    model: 'Lamborghini Revuelto V12',
    rating: 5,
    date: 'Il y a 2 semaines',
    comment:
      "Cadeau pour mon frère passionné de supercars. Il était ému aux larmes en allumant la lueur LED ambrée. Le prix de 49,99 € est incroyable pour une qualité artisanale pareille.",
    interior: 'Espace Collectionneur',
  },
]

const GALLERY_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop',
    title: 'Pagani Huayra & Cadre Relief 3D',
    model: 'Pagani Huayra V12',
  },
  {
    url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&auto=format&fit=crop',
    title: 'Audi R8 V10 Performance',
    model: 'Audi R8 V10',
  },
  {
    url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop',
    title: 'BMW M4 Competition Isle of Man',
    model: 'BMW M4 Competition',
  },
  {
    url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop',
    title: 'Finition Artisanale Atelier France',
    model: 'Bugatti Chiron W16',
  },
]

export function InteriorShowcaseSection() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
      
      {/* En-tête */}
      <ScrollReveal direction="up" delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-neutral-800 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                Note Globale 4.9/5 · Avis Vérifiés
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Dans l&apos;intimité de leurs intérieurs
            </h2>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-400/60 text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition-all shadow-md cursor-pointer"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-amber-400" />
              <span>Partager mon avis</span>
            </button>

            <div className="flex items-center gap-2.5 bg-neutral-900/80 border border-neutral-800 px-3.5 py-2.5 rounded-2xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <p className="text-[11px] font-semibold text-white">
                380+ passionnés en Europe
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Galerie Visuelle d'Intérieurs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {GALLERY_PHOTOS.map((photo, idx) => (
          <ScrollReveal key={photo.title} direction="up" delay={0.1 * (idx + 1)}>
            <div className="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-xl">
              <Image
                src={photo.url}
                alt={photo.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7] group-hover:brightness-[0.85]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block font-bold">
                  {photo.model}
                </span>
                <p className="text-sm font-bold text-white leading-tight">
                  {photo.title}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Cartes d'Avis Clients Vérifiés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((review, idx) => (
          <ScrollReveal key={review.id} direction="up" delay={0.1 * (idx + 1)}>
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 hover:border-neutral-700 transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-400 gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500">{review.date}</span>
                </div>

                <p className="text-xs text-neutral-300 font-light leading-relaxed italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-white text-xs">{review.name}</p>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-[10px] text-neutral-500 font-mono">
                    {review.location} · {review.model}
                  </p>
                </div>
                <span className="text-[9px] font-mono uppercase bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full">
                  Vérifié
                </span>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <LeaveReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productName="Atelier Dream Frame"
      />
    </section>
  )
}
