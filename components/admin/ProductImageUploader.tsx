'use client'

import { useState, useRef, useCallback } from 'react'
import { upload } from '@vercel/blob/client'
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Star,
  ArrowLeft,
  ArrowRight,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  Film,
} from 'lucide-react'
import { isVideoUrl } from '@/lib/utils'

interface ProductImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export function ProductImageUploader({
  images,
  onChange,
  maxImages = 8,
}: ProductImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [draggedCardIdx, setDraggedCardIdx] = useState<number | null>(null)
  const [touchActiveIdx, setTouchActiveIdx] = useState<number | null>(null)
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imagesRef = useRef(images)
  imagesRef.current = images

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const validFiles: File[] = []
      for (let i = 0; i < files.length; i++) {
        const f = files[i]
        const ext = f.name.split('.').pop()?.toLowerCase() || ''
        const isMedia =
          f.type.startsWith('image/') ||
          f.type.startsWith('video/') ||
          ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'heic', 'heif', 'mp4', 'mov', 'webm'].includes(ext)
        if (isMedia) {
          validFiles.push(f)
        }
      }

      if (validFiles.length === 0) {
        setUploadError('Veuillez sélectionner des fichiers valides (Images ou Vidéos).')
        return
      }

      if (imagesRef.current.length + validFiles.length > maxImages) {
        setUploadError(`Vous pouvez ajouter au maximum ${maxImages} photos par cadre.`)
        return
      }

      setUploading(true)
      setUploadError(null)

      const uploadedUrls: string[] = []

      for (const file of validFiles) {
        try {
          let finalUrl = ''
          
          try {
            // 1. Essai Client Upload (Vercel Blob) - Bypasse la limite de 4.5 Mo de Vercel !
            const newBlob = await upload(file.name, file, {
              access: 'public',
              handleUploadUrl: '/api/upload',
            })
            finalUrl = newBlob.url
          } catch (clientErr: any) {
            console.warn('Vercel Blob client upload échoué, essai fallback local/serveur:', clientErr)
            // 2. Fallback FormData (Local dev sans Vercel Blob)
            const formData = new FormData()
            formData.append('file', file)
            
            const res = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            })

            const data = await res.json()
            if (!res.ok || data.error) {
              throw new Error(data.error || 'Erreur lors du téléversement')
            }
            finalUrl = data.url
          }

          if (finalUrl) {
            uploadedUrls.push(finalUrl)
          }
        } catch (err: any) {
          setUploadError(err.message || 'Une erreur est survenue lors de l’envoi.')
        }
      }

      if (uploadedUrls.length > 0) {
        onChange([...imagesRef.current, ...uploadedUrls])
      }

      setUploading(false)
    },
    [maxImages, onChange]
  )

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
      // Reset input so the same file can be chosen again if needed
      e.target.value = ''
    }
  }

  const handleAddUrl = () => {
    const trimmed = urlInput.trim()
    if (trimmed) {
      if (images.length >= maxImages) {
        setUploadError(`Limite de ${maxImages} images atteinte.`)
        return
      }
      onChange([...images, trimmed])
      setUrlInput('')
      setShowUrlInput(false)
      setUploadError(null)
    }
  }

  const handleRemove = (index: number) => {
    const next = imagesRef.current.filter((_, i) => i !== index)
    onChange(next)
  }

  const handleSetPrimary = (index: number) => {
    if (index === 0) return
    const current = imagesRef.current
    const target = current[index]
    const remaining = current.filter((_, i) => i !== index)
    onChange([target, ...remaining])
  }

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1
    const current = imagesRef.current
    if (targetIndex < 0 || targetIndex >= current.length) return
    const next = [...current]
    const temp = next[index]
    next[index] = next[targetIndex]
    next[targetIndex] = temp
    onChange(next)
  }

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= imagesRef.current.length ||
      toIndex >= imagesRef.current.length
    ) {
      return
    }
    const next = [...imagesRef.current]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    onChange(next)
  }

  const handleTouchStart = (idx: number) => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
    touchTimerRef.current = setTimeout(() => {
      setTouchActiveIdx(idx)
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(40)
        } catch {}
      }
    }, 250)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchActiveIdx === null) return
    const touch = e.touches[0]
    const target = document.elementFromPoint(touch.clientX, touch.clientY)
    const cardEl = target?.closest('[data-card-index]')
    if (cardEl) {
      const targetIdx = Number(cardEl.getAttribute('data-card-index'))
      if (!isNaN(targetIdx) && targetIdx !== touchActiveIdx) {
        handleReorder(touchActiveIdx, targetIdx)
        setTouchActiveIdx(targetIdx)
      }
    }
  }

  const handleTouchEnd = () => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
    setTouchActiveIdx(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            Photos du cadre ({images.length}/{maxImages})
          </label>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Glissez vos photos ou choisissez-les depuis votre appareil (smartphone ou PC).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-neutral-400 hover:text-amber-400 transition flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlInput ? 'Fermer ajout par lien' : 'Ajouter par URL externe'}
        </button>
      </div>

      {/* Optional URL input fallback */}
      {showUrlInput && (
        <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
          >
            Ajouter
          </button>
        </div>
      )}

      {/* Drag & Drop Dropzone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
          isDragging
            ? 'border-amber-400 bg-amber-400/10 scale-[1.01]'
            : 'border-neutral-800 hover:border-neutral-700 bg-black/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/heic,image/heif,video/mp4,video/webm,video/quicktime,.heic,.heif,.mov"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition ${
              isDragging
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400'
            }`}
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-white">
              {isDragging ? 'Déposez vos médias ici' : 'Glissez-déposez vos médias ici'}
            </p>
            <p className="text-[11px] text-neutral-400">
              ou sélectionnez directement sur votre appareil
            </p>
          </div>

          <button
            type="button"
            disabled={uploading || images.length >= maxImages}
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-400/10 flex items-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Téléversement en cours...</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Choisir depuis l&apos;appareil / Médias récents</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-neutral-500 font-mono">
            Formats acceptés : JPG, PNG, WebP, MP4, WebM · Max 50 Mo par fichier
          </p>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Image Gallery Cards */}
      {images.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-[11px] text-neutral-400 font-medium">
            💡 Astuce : La première photo est l&apos;image principale. Cliquez sur l&apos;étoile pour définir la photo mise en avant.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 select-none">
            {images.map((imgUrl, idx) => {
              const isPrimary = idx === 0
              const isTouchActive = touchActiveIdx === idx

              return (
                <div
                  key={`${imgUrl}-${idx}`}
                  data-card-index={idx}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', String(idx))
                    setDraggedCardIdx(idx)
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.dataTransfer.dropEffect = 'move'
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    if (draggedCardIdx !== null && draggedCardIdx !== idx) {
                      handleReorder(draggedCardIdx, idx)
                      setDraggedCardIdx(null)
                    }
                  }}
                  onTouchStart={() => handleTouchStart(idx)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className={`group relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-950 border transition-all cursor-grab active:cursor-grabbing ${
                    isTouchActive
                      ? 'scale-105 border-amber-400 ring-4 ring-amber-400/40 shadow-2xl z-30'
                      : isPrimary
                      ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-lg shadow-amber-400/10'
                      : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {/* Render Video or Image based on extension */}
                  {isVideoUrl(imgUrl) ? (
                    <video
                      src={imgUrl}
                      className="w-full h-full object-cover pointer-events-none"
                      muted
                      loop
                      playsInline
                      autoPlay
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={imgUrl}
                      alt={`Visuel ${idx + 1}`}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  )}

                  {/* Top Badges (Left) */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 z-10 pointer-events-none">
                    {isPrimary ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
                        <Star className="w-2.5 h-2.5 fill-black" />
                        Principale
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-black/80 text-neutral-300 text-[9px] font-mono shadow">
                        #{idx + 1}
                      </span>
                    )}
                    {isVideoUrl(imgUrl) && (
                      <span className="px-1.5 py-0.5 rounded-full bg-black/85 border border-neutral-700 text-amber-300 text-[9px] font-mono flex items-center gap-1 shadow">
                        <Film className="w-2.5 h-2.5 text-amber-400" />
                        Vidéo
                      </span>
                    )}
                  </div>

                  {/* Top Delete Button (Right) — ALWAYS ACCESSIBLE WITH 1 TAP ON MOBILE */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(idx)
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/85 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/40 flex items-center justify-center transition shadow-md z-20 cursor-pointer active:scale-95"
                    title="Supprimer ce média"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Bottom Quick Controls (Always visible on mobile/touch, hover on desktop) */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-4 pb-1.5 px-2 flex items-center justify-between sm:opacity-0 sm:group-hover:opacity-100 transition-all z-20 pointer-events-auto">
                    <div className="flex items-center gap-1">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMove(idx, 'left')
                          }}
                          className="p-1.5 bg-neutral-800/90 hover:bg-neutral-700 active:bg-neutral-600 text-white rounded-lg transition text-xs flex items-center justify-center cursor-pointer shadow"
                          title="Déplacer vers la gauche"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {idx < images.length - 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMove(idx, 'right')
                          }}
                          className="p-1.5 bg-neutral-800/90 hover:bg-neutral-700 active:bg-neutral-600 text-white rounded-lg transition text-xs flex items-center justify-center cursor-pointer shadow"
                          title="Déplacer vers la droite"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSetPrimary(idx)
                        }}
                        className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-black text-[10px] font-bold rounded-full transition flex items-center gap-1 shadow cursor-pointer active:scale-95"
                        title="Définir comme photo principale"
                      >
                        <Star className="w-3 h-3 fill-black" />
                        <span>1ère</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

