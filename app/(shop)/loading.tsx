export default function ShopLoading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Ligne de progression supérieure dorée et raffinée */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent animate-pulse" />

      <div className="relative z-10 flex flex-col items-center space-y-4">
        {/* Spinner sobre et épuré avec touche dorée */}
        <div className="w-8 h-8 rounded-full border-2 border-neutral-800 border-t-amber-400 animate-spin shadow-[0_0_12px_rgba(251,191,36,0.15)]" />

        {/* Typographie minimale */}
        <p className="text-[10px] font-mono tracking-[0.35em] uppercase text-neutral-400 font-light">
          Chargement
        </p>
      </div>
    </div>
  )
}

