'use client'

import React from 'react'
import { PageTreeSnapshot } from '@/lib/page-builder/types'
import { History, RotateCcw, X, Layers, Calendar, CheckCircle2 } from 'lucide-react'

interface SnapshotsModalProps {
  isOpen: boolean
  snapshots: PageTreeSnapshot[]
  loading?: boolean
  onClose: () => void
  onRestore: (snapshotId: string) => void
}

export function SnapshotsModal({
  isOpen,
  snapshots,
  loading = false,
  onClose,
  onRestore,
}: SnapshotsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-6 text-white space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Historique des Versions &amp; Snapshots</h3>
              <p className="text-xs text-neutral-400">
                Retrouvez et restaurez les 20 dernières publications de votre page d’accueil
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-neutral-400">
            Chargement des sauvegardes...
          </div>
        ) : snapshots.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-xs text-neutral-400">Aucune publication enregistrée pour l’instant.</p>
            <p className="text-[11px] text-neutral-500">
              Dès que vous cliquez sur « Publier sur la boutique », un snapshot complet est sauvegardé automatiquement.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {snapshots.map((snap, idx) => {
              const isLatest = idx === 0

              return (
                <div
                  key={snap.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{snap.name}</span>
                      {isLatest && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold uppercase">
                          En Ligne Actuellement
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-neutral-500" />
                        {new Date(snap.publishedAt).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3 text-neutral-500" />
                        {snap.elementCount} éléments
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRestore(snap.id)}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-amber-400 hover:text-black text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurer</span>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
