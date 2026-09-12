'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X, CheckCircle, Sparkles, Send, ShieldCheck } from 'lucide-react'
import { submitReviewAction } from '@/app/actions/reviews'

interface LeaveReviewModalProps {
  isOpen: boolean
  onClose: () => void
  productSlug?: string
  productId?: string
  productName?: string
  onSuccess?: () => void
}

const RATING_LABELS: Record<number, string> = {
  1: 'Décevant',
  2: 'Moyen',
  3: 'Bien',
  4: 'Très bien — Belle pièce',
  5: 'Exceptionnel — Chef-d’œuvre d’atelier',
}

export function LeaveReviewModal({
  isOpen,
  onClose,
  productSlug,
  productId,
  productName = 'Cadre Dream Frame',
  onSuccess,
}: LeaveReviewModalProps) {
  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [formatPurchased, setFormatPurchased] = useState('Format Standard A4')
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const activeRating = hoverRating !== null ? hoverRating : rating

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const res = await submitReviewAction({
      productSlug,
      productId,
      productName,
      name,
      email,
      location,
      rating,
      title,
      comment,
      formatPurchased,
    })

    setSubmitting(false)

    if (res.success) {
      setSubmitted(true)
      if (onSuccess) onSuccess()
      setTimeout(() => {
        setSubmitted(false)
        onClose()
      }, 2500)
    } else {
      setError(res.error || 'Erreur lors de l’envoi')
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
          className="relative w-full max-w-lg bg-[#0e0e0c] border border-neutral-800 text-white rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-10 my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl text-white">Merci pour votre avis d’exception !</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto font-light leading-relaxed">
                  Votre retour d’expérience valorise le travail artisanal de notre atelier et éclaire la communauté des passionnés.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                  ✦ Témoignage certifié ✦
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Header */}
              <div className="space-y-1.5 border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold">
                    Retour d’Atelier
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">· Avis Vérifié</span>
                </div>
                <h2 className="text-xl sm:text-2xl text-white">
                  Partager votre avis
                </h2>
                <p className="text-xs text-neutral-400 font-light truncate">
                  Concernant : <strong className="text-white font-medium">{productName}</strong>
                </p>
              </div>

              {error && (
                <div className="p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs font-light">
                  ⚠️ {error}
                </div>
              )}

              {/* Note par étoiles interactive */}
              <div className="space-y-2 text-center py-2 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4">
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-mono">
                  Votre Note Globale
                </label>
                <div className="flex items-center justify-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 text-neutral-600 hover:scale-125 transition-transform duration-150 cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          star <= activeRating
                            ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-neutral-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-amber-300/90 font-medium h-4">
                  {RATING_LABELS[activeRating]}
                </p>
              </div>

              {/* Format & Coordonnées */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-[11px] text-neutral-400 font-medium">Votre Prénom ou Nom</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Alexandre V."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/60 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/80 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] text-neutral-400 font-medium">Votre Ville ou Région</label>
                  <input
                    type="text"
                    placeholder="Ex: Paris (75) ou Genève"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-black/60 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/80 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-[11px] text-neutral-400 font-medium">Format acquis</label>
                  <select
                    value={formatPurchased}
                    onChange={(e) => setFormatPurchased(e.target.value)}
                    className="w-full bg-black/60 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/80 transition"
                  >
                    <option value="Format Standard A4">Standard A4 (49,90 €)</option>
                    <option value="Grand Format A3 Collector">Grand A3 Collector (149,90 €)</option>
                    <option value="Prestige Galerie A2">Prestige Galerie A2 (249,90 €)</option>
                    <option value="Atelier Sur-Mesure">Pièce Sur-Mesure</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] text-neutral-400 font-medium">
                    Email <span className="text-neutral-500">(non affiché)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="nom@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/80 transition"
                  />
                </div>
              </div>

              {/* Titre & Commentaire */}
              <div className="space-y-1">
                <label className="block text-[11px] text-neutral-400 font-medium">Titre de votre expérience</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Une finition magistrale, rendu nocturne époustouflant"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/60 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/80 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] text-neutral-400 font-medium">
                  Votre Témoignage détaillé
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Décrivez la qualité du cadre, le relief 3D, le rétroéclairage LED, la réception du colis..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-black/60 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/80 transition resize-none leading-relaxed"
                />
              </div>

              {/* Mention de réassurance */}
              <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-light pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Votre avis aide d’autres passionnés à sublimer leur intérieur.</span>
              </div>

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-white hover:bg-neutral-100 disabled:opacity-50 text-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-white/10 cursor-pointer"
              >
                {submitting ? (
                  <span>Publication en cours...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-black" />
                    <span>Publier mon avis officiel</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
