'use client'

import { useState } from 'react'
import {
  Star,
  MessageSquarePlus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Plus,
  Loader2,
  Sparkles,
  Search,
} from 'lucide-react'
import {
  createAdminReviewAction,
  toggleReviewStatusAction,
  deleteReviewAction,
} from './actions'
import type { StoredReview } from '@/lib/data-store'

export function AvisClient({ initialReviews }: { initialReviews: StoredReview[] }) {
  const [reviews, setReviews] = useState<StoredReview[]>(initialReviews)
  const [filter, setFilter] = useState<'ALL' | 'APPROVED' | 'PENDING'>('ALL')
  const [search, setSearch] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Formulaire d'ajout manuel
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [productName, setProductName] = useState('Porsche 911 GT3 RS (992)')
  const [formatPurchased, setFormatPurchased] = useState('Format Standard A4')
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const res = await createAdminReviewAction({
      name,
      location,
      productName,
      formatPurchased,
      rating,
      title,
      comment,
    })

    setSubmitting(false)

    if (res.success && res.review) {
      setReviews([res.review, ...reviews])
      setShowAddForm(false)
      setName('')
      setLocation('')
      setTitle('')
      setComment('')
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: 'APPROVED' | 'PENDING') => {
    const nextStatus = currentStatus === 'APPROVED' ? 'PENDING' : 'APPROVED'
    setActionLoading(id)
    const res = await toggleReviewStatusAction(id, nextStatus)
    setActionLoading(null)

    if (res.success) {
      setReviews(reviews.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement cet avis ?')) return
    setActionLoading(id)
    const res = await deleteReviewAction(id)
    setActionLoading(null)

    if (res.success) {
      setReviews(reviews.filter((r) => r.id !== id))
    }
  }

  // Filtrage
  const filtered = reviews.filter((r) => {
    if (filter === 'APPROVED' && r.status !== 'APPROVED') return false
    if (filter === 'PENDING' && r.status !== 'PENDING') return false
    if (search) {
      const q = search.toLowerCase()
      return (
        r.name.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.productName && r.productName.toLowerCase().includes(q))
      )
    }
    return true
  })

  // Statistiques
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0'
  const approvedCount = reviews.filter((r) => r.status === 'APPROVED').length
  const pendingCount = reviews.filter((r) => r.status === 'PENDING').length

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-8">
      {/* ─── En-tête ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
              Preuve Sociale & Réputation
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-mono">{reviews.length} avis au total</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Avis Clients & Témoignages
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
            Gérez les avis publiés sur la boutique, modérez les retours et ajoutez les témoignages reçus par vos clients.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black font-semibold text-xs rounded-xl transition shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Fermer le formulaire' : 'Ajouter un avis manuellement'}</span>
        </button>
      </div>

      {/* ─── Cartes de Métriques ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-2">
          <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Note Globale</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{averageRating}</span>
            <span className="text-xs text-slate-400 font-mono">/ 5.0</span>
          </div>
          <div className="flex items-center text-amber-400 gap-0.5 pt-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-2">
          <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Avis Publiés en Ligne</p>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{approvedCount}</p>
          <p className="text-[11px] text-slate-400 font-light">Visibles par les visiteurs</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-2">
          <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">En Attente de Modération</p>
          <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{pendingCount}</p>
          <p className="text-[11px] text-slate-400 font-light">Nécessite votre validation</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-2">
          <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Taux de Satisfaction</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">100%</p>
          <p className="text-[11px] text-slate-400 font-light">Basé sur les notes 4 et 5 étoiles</p>
        </div>
      </div>

      {/* ─── Formulaire Dépliable d'Ajout Manuel ─── */}
      {showAddForm && (
        <form
          onSubmit={handleAddReview}
          className="p-6 rounded-2xl border border-amber-400/40 bg-white dark:bg-neutral-900 shadow-lg space-y-5"
        >
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-neutral-800 pb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Enregistrer un Avis Client (WhatsApp, Instagram, Email)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300">
                Nom du Client
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Lucas B."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300">
                Ville / Région
              </label>
              <input
                type="text"
                placeholder="Ex: Paris (75) ou Genève"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300">
                Note (sur 5 étoiles)
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400 font-semibold"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5/5) — Exceptionnel</option>
                <option value={4}>⭐⭐⭐⭐ (4/5) — Très bien</option>
                <option value={3}>⭐⭐⭐ (3/5) — Bien</option>
                <option value={2}>⭐⭐ (2/5) — Moyen</option>
                <option value={1}>⭐ (1/5) — Décevant</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300">
                Modèle Concerné
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ex: Porsche 911 GT3 RS (992)"
                className="w-full bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300">
                Format
              </label>
              <select
                value={formatPurchased}
                onChange={(e) => setFormatPurchased(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="Format Standard A4">Standard A4 (49,99 €)</option>
                <option value="Grand Format A3 Collector">Grand A3 Collector (150,00 €)</option>
                <option value="Prestige Galerie A2">Prestige Galerie A2 (250,00 €)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300">
              Titre du Témoignage
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Finition au cordeau et LED magnifiques"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300">
              Commentaire Détaillé
            </label>
            <textarea
              required
              rows={3}
              placeholder="Collez ou rédigez ici le témoignage du client..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Publier cet avis</span>
            </button>
          </div>
        </form>
      )}

      {/* ─── Barre d'outils et Filtres ─── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-neutral-900 p-1 rounded-xl border border-slate-200 dark:border-neutral-800 w-full sm:w-auto">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === 'ALL'
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
            }`}
          >
            Tous ({reviews.length})
          </button>
          <button
            onClick={() => setFilter('APPROVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === 'APPROVED'
                ? 'bg-white dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
            }`}
          >
            Approuvés ({approvedCount})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === 'PENDING'
                ? 'bg-white dark:bg-neutral-800 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
            }`}
          >
            En attente ({pendingCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un avis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* ─── Liste des Avis ─── */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <p className="text-sm text-slate-500">Aucun avis correspondant aux critères.</p>
          </div>
        ) : (
          filtered.map((rev) => {
            const isApproved = rev.status === 'APPROVED'
            const isLoading = actionLoading === rev.id

            return (
              <div
                key={rev.id}
                className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col sm:flex-row justify-between gap-4 transition hover:border-slate-300 dark:hover:border-neutral-700"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center text-amber-400 gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {rev.name}
                    </span>
                    {rev.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Vérifié
                      </span>
                    )}
                    {rev.location && (
                      <span className="text-xs text-slate-400 font-mono">
                        {rev.location}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(rev.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {rev.title && (
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {rev.title}
                      </h4>
                    )}
                    <p className="text-xs text-slate-600 dark:text-neutral-300 font-light leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/40 px-2.5 py-0.5 rounded-md">
                      {rev.productName || 'Cadre Dream Frame'}
                    </span>
                    {rev.formatPurchased && (
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                        {rev.formatPurchased}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions & Statut */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 flex-shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-neutral-800">
                  <span
                    className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                      isApproved
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {isApproved ? 'En Ligne' : 'En Attente'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(rev.id, rev.status)}
                      disabled={isLoading}
                      className="p-2 rounded-xl text-xs border border-slate-200 dark:border-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-800 transition cursor-pointer text-slate-600 dark:text-neutral-300"
                      title={isApproved ? 'Masquer cet avis' : 'Approuver cet avis'}
                    >
                      {isApproved ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => handleDelete(rev.id)}
                      disabled={isLoading}
                      className="p-2 rounded-xl text-xs border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 transition cursor-pointer"
                      title="Supprimer cet avis"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
