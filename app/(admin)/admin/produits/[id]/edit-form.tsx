'use client'

import { updateProduct, deleteProduct } from '../actions'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Plus, Trash, Trash2 } from 'lucide-react'
import { ProductImageUploader } from '@/components/admin/ProductImageUploader'

interface EditProductFormProps {
  product: {
    id: string
    name: string
    brand: string
    description: string
    price: number | any
    isActive: boolean
    isFeatured: boolean
    images: string[]
    variants: { stock: number; stockAlert: number }[]
  }
}

export function EditProductForm({ product }: EditProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [imageUrlInput, setImageUrlInput] = useState('')
  const [images, setImages] = useState<string[]>(product.images || [])

  const variant = product.variants?.[0] || { stock: 10, stockAlert: 3 }

  const addImage = () => {
    if (imageUrlInput.trim()) {
      setImages([...images, imageUrlInput.trim()])
      setImageUrlInput('')
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (images.length === 0) {
      setError('Au moins une image est requise.')
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await updateProduct(product.id, images, formData)
      if (res?.error) {
        setError(res.error)
        setLoading(false)
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la mise à jour')
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cadre du catalogue ? Cette action est irréversible.')) {
      setDeleting(true)
      try {
        await deleteProduct(product.id)
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la suppression')
        setDeleting(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-bold">
            ⚠️ {error}
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
              defaultValue={product.name}
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
              defaultValue={product.brand}
              placeholder="Ex: Ferrari, Porsche..."
              className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400/80 transition"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
            Description artistique & technique
          </label>
          <textarea
            name="description"
            required
            rows={5}
            defaultValue={product.description}
            className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400/80 transition leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Prix */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Prix unique (€ TTC)
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              defaultValue={Number(product.price) || 49.90}
              required
              min={0}
              className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400/80 font-mono transition"
            />
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              defaultValue={variant.stock ?? 10}
              required
              min={0}
              className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400/80 font-mono transition"
            />
          </div>

          {/* Alert */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Alerte stock bas
            </label>
            <input
              type="number"
              name="stockAlert"
              defaultValue={variant.stockAlert ?? 3}
              required
              min={0}
              className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400/80 font-mono transition"
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-6 border-t border-neutral-800 pt-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={product.isActive}
              className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-amber-400 focus:ring-amber-400"
            />
            <span className="text-xs font-semibold text-neutral-200">Actif (visible sur le site)</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={product.isFeatured}
              className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-amber-400 focus:ring-amber-400"
            />
            <span className="text-xs font-semibold text-neutral-200">Mettre en avant sur la page d&apos;accueil</span>
          </label>
        </div>

        {/* Images */}
        <div className="border-t border-neutral-800 pt-6">
          <ProductImageUploader
            images={images}
            onChange={(newImages) => setImages(newImages)}
          />
        </div>

        {/* Save Actions */}
        <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            type="button"
            disabled={deleting}
            onClick={handleDelete}
            className="px-4 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-xl text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Supprimer du catalogue
          </button>

          <div className="flex gap-3 self-end sm:self-auto">
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
                  Enregistrement...
                </>
              ) : (
                'Enregistrer les modifications'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
