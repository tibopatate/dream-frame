import Image from 'next/image'

export default function ShopLoading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#040403] flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Ligne de progression discrète et sombre */}
      <div className="fixed top-0 left-0 right-0 h-[1px] z-50 bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

      <div className="relative z-10 flex flex-col items-center space-y-4">
        {/* Logo Dream Frame très sombre et discret */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <Image
            src="/images/dream-frame-luxury-logo.png"
            alt="Dream Frame"
            width={44}
            height={44}
            priority
            className="w-full h-auto object-contain opacity-40"
          />
        </div>

        {/* Spinner sobre et sombre */}
        <div className="w-4 h-4 rounded-full border border-neutral-900 border-t-neutral-600 animate-spin" />

        {/* Typographie minimale atténuée */}
        <p className="text-[8px] font-mono tracking-[0.3em] uppercase text-neutral-600">
          Chargement
        </p>
      </div>
    </div>
  )
}
