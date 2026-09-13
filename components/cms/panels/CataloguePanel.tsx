'use client'

import { useState, useEffect } from 'react'
import {
  Grid3X3,
  Plus,
  Sparkles,
  Check,
  ExternalLink,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Layers,
  ChevronRight,
  ArrowRight,
  Loader2,
  X,
  Package,
} from 'lucide-react'
import Link from 'next/link'
import {
  getCollectionsAction,
  saveCollectionAction,
  deleteCollectionAction,
} from '@/app/(admin)/admin/personnalisation/actions'
import type { StoredCollection } from '@/lib/data-store'

interface CataloguePanelProps {
  products?: any[]
  onSelectCollectionSection?: () => void
  onUpdateHomepageCollection?: (collectionId: string, productIds: string[], collectionName?: string) => void
}

export function CataloguePanel({
  products = [],
  onSelectCollectionSection,
  onUpdateHomepageCollection,
}: CataloguePanelProps) {
  const [collections, setCollections] = useState<StoredCollection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [isActive, setIsActive] = useState(true)

  // Load collections
  const loadCollections = async () => {
    setIsLoading(true)
    try {
      const res = await getCollectionsAction()
      if (res.success && res.collections) {
        setCollections(res.collections)
      }
    } catch (err: any) {
      console.error('Error loading collections:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCollections()
  }, [])

  const startCreate = () => {
    setEditingId(null)
    setName('')
    setDescription('')
    setImage('')
    setSelectedProductIds(products.map((p) => p.id || p.slug))
    setIsActive(true)
    setErrorMsg(null)
    setIsEditing(true)
  }

  const startEdit = (col: StoredCollection) => {
    setEditingId(col.id)
    setName(col.name)
    setDescription(col.description || '')
    setImage(col.image || '')
    setSelectedProductIds(col.productIds || [])
    setIsActive(col.isActive)
    setErrorMsg(null)
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditingId(null)
    setErrorMsg(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setErrorMsg('Le nom de la collection est requis.')
      return
    }

    setIsSaving(true)
    setErrorMsg(null)

    try {
      const res = await saveCollectionAction({
        id: editingId || undefined,
        name: name.trim(),
        description: description.trim(),
        image: image.trim() || undefined,
        productIds: selectedProductIds,
        isActive,
      })

      if (res.success) {
        await loadCollections()
        setIsEditing(false)
        setEditingId(null)
      } else {
        setErrorMsg(res.error || 'Une erreur est survenue lors de l’enregistrement.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur inconnue')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string, colName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la collection "${colName}" ?`)) {
      return
    }

    try {
      const res = await deleteCollectionAction(id)
      if (res.success) {
        await loadCollections()
      }
    } catch (err) {
      console.error('Error deleting collection:', err)
    }
  }

  const toggleProductInSelection = (prodId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(prodId) ? prev.filter((id) => id !== prodId) : [...prev, prodId]
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-red-600" />
            Collections de la Boutique
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gérez vos collections réelles et définissez les modèles mis en valeur.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={startCreate}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Créer</span>
          </button>
        )}
      </div>

      {/* Quick link to customize homepage collection */}
      {onSelectCollectionSection && !isEditing && (
        <button
          type="button"
          onClick={onSelectCollectionSection}
          className="w-full p-3 bg-red-50 border border-red-200 rounded-xl text-left hover:bg-red-100/60 transition cursor-pointer flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold text-red-700">Section Galerie sur la Page d&apos;Accueil</p>
            <p className="text-[11px] text-red-600/80">Choisir quelle collection ou quels cadres afficher en vitrine</p>
          </div>
          <Sparkles className="w-4 h-4 text-red-600 flex-shrink-0" />
        </button>
      )}

      {/* ─── FORMULAIRE AJOUT / ÉDITION ─── */}
      {isEditing ? (
        <form onSubmit={handleSave} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {editingId ? 'Modifier la Collection' : 'Nouvelle Collection Réelle'}
            </h3>
            <button
              type="button"
              onClick={cancelEdit}
              className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Nom */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500">Nom de la Collection *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Collection Ferrari, Grands Formats Prestige..."
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description courte de cette collection..."
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
            />
          </div>

          {/* Image de couverture */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500">Image de couverture (URL)</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>

          {/* Statut actif */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-slate-700">Collection visible en boutique</span>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                isActive ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 ${
                  isActive ? 'left-5' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Choix des produits de cette collection */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold text-slate-500">
                Cadres rattachés à cette collection ({selectedProductIds.length})
              </label>
              {products.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedProductIds(
                      selectedProductIds.length === products.length
                        ? []
                        : products.map((p) => p.id || p.slug)
                    )
                  }
                  className="text-[10px] text-red-600 hover:underline cursor-pointer font-medium"
                >
                  {selectedProductIds.length === products.length ? 'Tout décocher' : 'Tout cocher'}
                </button>
              )}
            </div>

            {products.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                Aucun cadre configuré dans la boutique. Créez des produits dans l&apos;onglet Produits.
              </p>
            ) : (
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                {products.map((prod) => {
                  const pid = prod.id || prod.slug
                  const isChecked = selectedProductIds.includes(pid)
                  return (
                    <div
                      key={pid}
                      onClick={() => toggleProductInSelection(pid)}
                      className={`flex items-center gap-2.5 p-2 rounded-lg border transition cursor-pointer ${
                        isChecked
                          ? 'border-red-400 bg-red-50/50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 ${
                          isChecked ? 'bg-red-600 border-red-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="w-8 h-8 rounded bg-neutral-900 overflow-hidden flex-shrink-0 border border-slate-200 relative">
                        {prod.images?.[0] ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-400">
                            N/A
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{prod.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {prod.brand} · {prod.price} €
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Boutons validation */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={cancelEdit}
              disabled={isSaving}
              className="px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>{editingId ? 'Mettre à jour' : 'Créer la collection'}</span>
            </button>
          </div>
        </form>
      ) : null}

      {/* ─── LISTE DES COLLECTIONS EXISTANTES ─── */}
      {!isEditing && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Vos Collections Disponibles
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {collections.length} collection{collections.length > 1 ? 's' : ''}
            </span>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-slate-400 flex items-center justify-center gap-2 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-red-600" />
              <span>Chargement de vos collections...</span>
            </div>
          ) : collections.length === 0 ? (
            <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center space-y-2">
              <Layers className="w-6 h-6 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-700">Aucune collection créée</p>
              <p className="text-[11px] text-slate-400">
                Créez votre première collection pour organiser vos cadres par univers ou gamme.
              </p>
              <button
                type="button"
                onClick={startCreate}
                className="mt-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Créer une collection</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {collections.map((col) => (
                <div
                  key={col.id}
                  className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {col.image ? (
                        <div className="w-10 h-10 rounded-lg bg-neutral-900 overflow-hidden flex-shrink-0 border border-slate-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={col.image} alt={col.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                          DF
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900 truncate">{col.name}</p>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              col.isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            {col.isActive ? 'Active' : 'Masquée'}
                          </span>
                        </div>
                        {col.description && (
                          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{col.description}</p>
                        )}
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {col.productIds?.length || 0} modèle{(col.productIds?.length || 0) > 1 ? 's' : ''} associé{ (col.productIds?.length || 0) > 1 ? 's' : '' }
                        </p>
                      </div>
                    </div>

                    {/* Actions Modifier / Supprimer */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(col)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition cursor-pointer"
                        title="Modifier cette collection"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(col.id, col.name)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer"
                        title="Supprimer cette collection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Boutons d'action rapide */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    {onUpdateHomepageCollection && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateHomepageCollection(col.id, col.productIds || [], col.name)
                        }
                        className="text-[11px] font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-md transition cursor-pointer inline-flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-red-500" />
                        <span>Mettre en vitrine accueil</span>
                      </button>
                    )}

                    <Link
                      href={`/catalogue`}
                      target="_blank"
                      className="text-[11px] text-slate-400 hover:text-slate-700 inline-flex items-center gap-1 ml-auto"
                    >
                      <span>Aperçu boutique</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick link to Products */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
        <h4 className="text-xs font-bold text-slate-800">Gestion des Fiches Produits</h4>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Pour créer un nouveau cadre, ajuster son tarif unitaire (49,90€, 149,90€, 249,90€) ou son stock, ouvrez l&apos;inventaire des produits.
        </p>
        <div className="pt-1">
          <Link
            href="/admin/produits"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
          >
            <span>Ouvrir l&apos;inventaire des produits</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}

