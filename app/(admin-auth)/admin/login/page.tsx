'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@dreamframe.fr')
  const [password, setPassword] = useState('dreamframe2026!')
  const [loading, setLoading] = useState(false)
  const [quickLoading, setQuickLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/admin/dashboard',
      })

      if (res?.error) {
        setError("Identifiants incorrects. Veuillez vérifier l'email et le mot de passe.")
        setLoading(false)
      } else {
        window.location.href = '/admin/dashboard'
      }
    } catch {
      setError('Une erreur est survenue lors de la connexion.')
      setLoading(false)
    }
  }

  const handleQuickLogin = async () => {
    setQuickLoading(true)
    setError(null)

    try {
      const res = await signIn('credentials', {
        quickLogin: 'true',
        redirect: false,
        callbackUrl: '/admin/dashboard',
      })

      if (res?.error) {
        setError('Impossible de se connecter en accès rapide.')
        setQuickLoading(false)
      } else {
        window.location.href = '/admin/dashboard'
      }
    } catch {
      setError('Une erreur est survenue.')
      setQuickLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080807] text-white flex flex-col items-center justify-center p-4 selection:bg-amber-400 selection:text-black">
      {/* Lien retour boutique */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="text-xs text-neutral-400 hover:text-white transition flex items-center gap-1.5 font-semibold uppercase tracking-wider"
        >
          ← Retour à la boutique
        </Link>
      </div>

      <div className="w-full max-w-md space-y-8 my-auto">
        {/* Logo & Titre */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-neutral-800 bg-neutral-900 shadow-xl overflow-hidden p-1">
            <Image src="/logo.jpg" alt="Dream Frame" width={56} height={56} className="object-cover rounded-xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            Dream Frame Admin
          </h1>
          <p className="text-neutral-400 text-xs tracking-widest uppercase">
            Cockpit de gestion & atelier
          </p>
        </div>

        {/* Card de Connexion */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Bouton Accès Rapide Propriétaire */}
          <div className="p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Accès Rapide Propriétaire
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">1 Clic</span>
            </div>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              Connectez-vous immédiatement à votre tableau de bord sans mot de passe.
            </p>
            <button
              type="button"
              onClick={handleQuickLogin}
              disabled={quickLoading || loading}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-400/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
            >
              {quickLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connexion instantanée...
                </>
              ) : (
                <>
                  Entrer dans l&apos;Admin (1 clic)
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-neutral-800 w-full" />
            <span className="bg-neutral-900 px-3 text-[10px] text-neutral-500 uppercase tracking-widest absolute font-semibold">
              ou identifiants
            </span>
          </div>

          {/* Formulaire standard */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dreamframe.fr"
                  className="w-full bg-black/60 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400/80 transition shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/60 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400/80 transition shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || quickLoading}
              className="w-full py-3.5 bg-white hover:bg-neutral-100 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Rappel des clés */}
          <div className="pt-2 border-t border-neutral-800/80 text-[10px] text-neutral-500 space-y-1 font-mono">
            <p className="flex items-center gap-1.5 text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Sécurité session JWT 30 jours
            </p>
            <p>Par défaut : <code className="text-amber-300">dreamframe2026!</code></p>
          </div>
        </div>

        <p className="text-center text-neutral-600 text-xs font-mono">
          Dream Frame SAS · Plateforme Réservée
        </p>
      </div>
    </div>
  )
}
