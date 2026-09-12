import Image from 'next/image'

export default function ShopLoading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#080807] flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Barre de progression supérieure dorée / ambre */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-600 animate-pulse shadow-[0_0_15px_rgba(251,191,36,0.6)]" />

      {/* Halo d'ambiance sombre et feutré */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[140px] pointer-events-none animate-pulse" />

      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Cadre Logo avec anneau d'orfèvrerie en rotation fluide */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Anneau extérieur rotatif */}
          <div className="absolute inset-0 rounded-full border border-amber-500/30 border-t-amber-400 animate-spin" style={{ animationDuration: '1.2s' }} />
          <div className="absolute inset-2 rounded-full border border-white/10 border-b-amber-300/40 animate-spin" style={{ animationDuration: '2.5s', animationDirection: 'reverse' }} />

          {/* Logo Dream Frame centré */}
          <div className="relative w-16 h-16 rounded-full bg-black/90 border border-neutral-800 flex items-center justify-center p-3 shadow-2xl shadow-black">
            <Image
              src="/images/dream-frame-luxury-logo.png"
              alt="Dream Frame"
              width={56}
              height={56}
              priority
              className="w-full h-auto object-contain brightness-110 drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]"
            />
          </div>
        </div>

        {/* Typographie de marque Trajan / Serif */}
        <div className="text-center space-y-1.5">
          <p className="text-xs font-mono tracking-[0.35em] uppercase text-amber-400 font-bold">
            DREAM FRAME
          </p>
          <p className="text-[10px] text-neutral-400 tracking-[0.2em] uppercase font-light">
            Manufacture d&apos;Art Automobile
          </p>
        </div>

        {/* Points de pulsation subtils */}
        <div className="flex items-center gap-1.5 pt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-ping" style={{ animationDuration: '1.4s' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-ping" style={{ animationDuration: '1.4s', animationDelay: '0.2s' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/40 animate-ping" style={{ animationDuration: '1.4s', animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  )
}
