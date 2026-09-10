'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Sparkles,
  Sun,
  Moon,
  ShieldCheck,
  Star,
  Palette,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produits', label: 'Catalogue Cadres', icon: Package },
  { href: '/admin/commandes', label: 'Commandes', icon: ShoppingBag },
  { href: '/admin/avis', label: 'Avis Clients', icon: Star },
  { href: '/admin/personnalisation', label: 'Personnalisation du Site', icon: Palette },
  { href: '/admin/stock', label: 'Gestion des Stocks', icon: BarChart3 },
  { href: '/admin/collaborateurs', label: 'Collaborateurs', icon: Users },
  { href: '/admin/parametres', label: 'Paramètres & Boutique', icon: Settings },
]

export function AdminShell({
  children,
  userName = 'Morgan',
  userEmail = 'admin@dreamframe.fr',
}: {
  children: React.ReactNode
  userName?: string
  userEmail?: string
}) {
  const pathname = usePathname()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('dreamframe_admin_theme') as 'light' | 'dark' | null
    if (saved) {
      setTheme(saved)
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('dreamframe_admin_theme', next)
  }

  const isLight = true

  return (
    <div
      data-admin-theme="light"
      className="min-h-screen flex transition-colors duration-200 bg-slate-50 text-slate-900"
    >
      {/* ─── SIDEBAR ─── */}
      <aside
        className="w-64 flex-shrink-0 flex flex-col justify-between border-r transition-colors duration-200 bg-white border-slate-200/90 shadow-sm"
      >
        <div className="space-y-5">
          {/* Header Logo */}
          <div
            className={`p-5 border-b flex items-center justify-between ${
              isLight ? 'border-slate-100' : 'border-neutral-800/80'
            }`}
          >
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl border border-slate-200 overflow-hidden bg-white relative shadow-sm flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="Dream Frame"
                  fill
                  className="object-cover group-hover:scale-105 transition"
                />
              </div>
              <div>
                <p className="font-extrabold text-sm tracking-tight uppercase">Dream Frame</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-[10px] font-mono tracking-widest uppercase font-semibold text-slate-500">
                    Cockpit Admin
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Boutons d'Action Rapide : Boutique & Thème */}
          <div className="px-4 space-y-2">
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all group ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
                  : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Voir la boutique
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
            </Link>

          </div>

          {/* Navigation Principale */}
          <nav className="px-3 space-y-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href))

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-red-50 text-red-600 font-bold border border-red-100 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-red-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Profil & Déconnexion en bas */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-xs font-black text-red-600 flex-shrink-0">
              {userName[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-slate-800">{userName}</p>
              <p className="text-[10px] text-slate-400 truncate font-mono">{userEmail}</p>
            </div>
          </div>

          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border text-slate-600 hover:text-red-600 hover:bg-red-50 border-slate-200 hover:border-red-200 bg-white"
            >
              <LogOut className="w-3.5 h-3.5" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* ─── CONTENU PRINCIPAL ─── */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
