import Image from 'next/image'

export default function ShopLoading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#080807] flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Ligne de progression supérieure ultra-fine et discrète */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-50 bg-gradient-to-r from-amber-500/40 via-amber-300 to-amber-500/40 animate-pulse" />

      <div className="relative z-10 flex flex-col items-center space-y-5">
        {/* Logo Dream Frame épuré */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          <Image
            src="/images/dream-frame-luxury-logo.png"
            alt="Dream Frame"
            width={48}
            height={48}
            priority
            className="w-full h-auto object-contain opacity-90"
          />
        </div>

        {/* Spinner discret et sobre */}
        <div className="w-5 h-5 rounded-full border border-neutral-800 border-t-amber-400/80 animate-spin" />

        {/* Typographie minimale */}
        <p className="text-[9px] font-mono tracking-[0.35em] uppercase text-neutral-400">
          Chargement
        </p>
      </div>
    </div>
  )
}

