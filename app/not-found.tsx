import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Compass, Lock, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080807] text-white flex flex-col justify-between p-6 selection:bg-amber-400 selection:text-black">
      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-amber-500/20">
            <Image src="/logo.jpg" alt="Dream Frame" fill className="object-cover" />
          </div>
          <span className="text-sm font-black tracking-widest uppercase text-white">
            Dream Frame
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-amber-400 transition"
        >
          <Home className="w-4 h-4" />
          <span>Boutique</span>
        </Link>
      </header>

      {/* Main 404 Hero */}
      <main className="max-w-md w-full mx-auto my-auto text-center space-y-6 py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-neutral-900 border border-amber-500/30 shadow-2xl shadow-amber-500/10">
          <span className="text-3xl font-black text-amber-400 font-mono tracking-tighter">404</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Page Introuvable
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm mx-auto">
            La trajectoire que vous suivez n'existe pas ou a été déplacée. Choisissez une destination ci-dessous.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition shadow-lg shadow-amber-400/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la boutique</span>
          </Link>

          <Link
            href="/catalogue"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-semibold text-xs hover:bg-neutral-800 hover:border-neutral-700 transition"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Voir la collection</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-neutral-900">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 hover:text-neutral-300 transition uppercase tracking-wider"
          >
            <Lock className="w-3 h-3" />
            <span>Connexion Administrateur</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center py-4 text-[11px] text-neutral-600 font-mono">
        © {new Date().getFullYear()} Dream Frame — Atelier d'art automobile d'exception
      </footer>
    </div>
  )
}
