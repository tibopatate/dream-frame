import React from 'react'
import Image from 'next/image'

export default function AdminLoading() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center p-6 bg-slate-50/50">
      {/* ─── BARRE DE PROGRESSION SUPÉRIEURE ULTRA-RÉACTIVE ─── */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 overflow-hidden bg-slate-100">
        <div className="h-full bg-gradient-to-r from-red-600 via-amber-400 to-red-600 animate-[progress_1.2s_ease-in-out_infinite] shadow-[0_0_12px_rgba(220,38,38,0.6)]" />
      </div>

      {/* ─── ANIMATION CENTRALE DE CHARGEMENT LUXE ─── */}
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xl max-w-sm w-full text-center">
        {/* Halo rotatif autour du logo */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl border-2 border-red-500/20 border-t-red-600 animate-spin" />
          <div className="w-12 h-12 rounded-xl overflow-hidden relative shadow-md bg-white border border-slate-100 flex items-center justify-center">
            <Image
              src="/logo.jpg"
              alt="Dream Frame"
              width={48}
              height={48}
              className="object-cover animate-pulse"
              priority
            />
          </div>
        </div>

        {/* Texte indicateur */}
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-800 tracking-tight">
            Chargement de l'administration
          </p>
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <p className="text-[11px] font-mono text-slate-400">
              Synchronisation instantanée...
            </p>
          </div>
        </div>

        {/* Barres squelettes d'ambiance */}
        <div className="w-full pt-2 space-y-2">
          <div className="h-2 w-3/4 mx-auto bg-slate-100 rounded-full animate-pulse" />
          <div className="h-2 w-1/2 mx-auto bg-slate-100 rounded-full animate-pulse delay-75" />
        </div>
      </div>
    </div>
  )
}
