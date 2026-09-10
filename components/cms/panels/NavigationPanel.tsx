'use client'

import { useState } from 'react'
import { Compass, GripVertical, Plus, Trash2, Check, Eye } from 'lucide-react'

interface NavLinkItem {
  id: string
  label: string
  href: string
  active: boolean
}

export function NavigationPanel() {
  const [links, setLinks] = useState<NavLinkItem[]>([
    { id: '1', label: 'Accueil', href: '/', active: true },
    { id: '2', label: 'Collection', href: '/catalogue', active: true },
    { id: '3', label: 'Atelier Sur-Mesure', href: '/configurateur', active: true },
    { id: '4', label: 'Savoir-Faire', href: '/#craft', active: true },
    { id: '5', label: 'Avis Clients', href: '/#avis', active: true },
  ])

  const [stickyHeader, setStickyHeader] = useState(true)
  const [transparentHeader, setTransparentHeader] = useState(true)
  const [showAnnouncement, setShowAnnouncement] = useState(true)
  const [announcementText, setAnnouncementText] = useState(
    'LIVRAISON COLISSIMO SUIVIE 100% OFFERTE · EXPÉDITION 24/48H'
  )

  const [newLabel, setNewLabel] = useState('')
  const [newHref, setNewHref] = useState('')

  const handleAddLink = () => {
    if (!newLabel || !newHref) return
    setLinks((prev) => [
      ...prev,
      { id: `link-${Date.now()}`, label: newLabel, href: newHref, active: true },
    ])
    setNewLabel('')
    setNewHref('')
  }

  const handleDeleteLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id))
  }

  const toggleLink = (id: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l))
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Compass className="w-5 h-5 text-red-600" />
          Navigation &amp; Menu
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Configurez les liens du menu principal et les options d&apos;affichage du header.
        </p>
      </div>

      {/* Menu links list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Liens du Header</h3>
          <span className="text-[11px] text-slate-400 font-mono">{links.length} liens</span>
        </div>

        <div className="space-y-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <GripVertical className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{link.label}</p>
                  <p className="text-[10px] font-mono text-slate-400 truncate">{link.href}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => toggleLink(link.id)}
                  className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
                    link.active
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                  title={link.active ? 'Lien actif' : 'Lien masqué'}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteLink(link.id)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add new link form */}
        <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
          <p className="text-[11px] font-bold text-slate-700">Ajouter un lien au menu</p>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Texte (ex: Contact)"
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <input
              type="text"
              value={newHref}
              onChange={(e) => setNewHref(e.target.value)}
              placeholder="Lien (ex: /contact)"
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
            />
          </div>
          <button
            type="button"
            onClick={handleAddLink}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter au menu
          </button>
        </div>
      </div>

      {/* Header behavior options */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Comportement du Header</h3>

        <div className="space-y-2">
          <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Header Flottant Suiveur (Sticky)</p>
              <p className="text-[10px] text-slate-400">Reste accessible en haut de l&apos;écran lors du défilement</p>
            </div>
            <button
              type="button"
              onClick={() => setStickyHeader(!stickyHeader)}
              className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                stickyHeader ? 'bg-red-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                  stickyHeader ? 'translate-x-4.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Transparence sur le Hero</p>
              <p className="text-[10px] text-slate-400">Fond flouté par-dessus la photographie de supercar</p>
            </div>
            <button
              type="button"
              onClick={() => setTransparentHeader(!transparentHeader)}
              className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                transparentHeader ? 'bg-red-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                  transparentHeader ? 'translate-x-4.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Barre d&apos;Annonce Supérieure</p>
                <p className="text-[10px] text-slate-400">Bandeau de réassurance tout en haut</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAnnouncement(!showAnnouncement)}
                className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                  showAnnouncement ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                    showAnnouncement ? 'translate-x-4.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {showAnnouncement && (
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500 mt-1 font-medium"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
