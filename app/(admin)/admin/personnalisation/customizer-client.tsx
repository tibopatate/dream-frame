'use client'

import { useState } from 'react'
import {
  Palette,
  Smartphone,
  Monitor,
  Save,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Type,
  Layout,
  Zap,
  RotateCcw,
  Eye,
  Sliders,
} from 'lucide-react'
import { updateCustomizerAction } from './actions'
import type { StoredSettings } from '@/lib/data-store'

export function CustomizerClient({ initialSettings }: { initialSettings: StoredSettings }) {
  const [settings, setSettings] = useState<StoredSettings>(initialSettings)
  const [viewport, setViewport] = useState<'mobile' | 'desktop'>('desktop')
  const [activeAccordion, setActiveAccordion] = useState<string | null>('hero')
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id)
  }

  const handleChange = (key: keyof StoredSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSavedSuccess(false)
    const res = await updateCustomizerAction(settings)
    setSaving(false)
    if (res.success) {
      setSavedSuccess(true)
      setIframeKey((prev) => prev + 1)
      setTimeout(() => setSavedSuccess(false), 3000)
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-100 dark:bg-black text-slate-900 dark:text-white overflow-hidden">
      {/* ─── BARRE SUPÉRIEURE SHOPIFY ─── */}
      <div className="h-16 px-6 border-b border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0a] flex items-center justify-between flex-shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-500">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm uppercase tracking-wider">
              Personnalisateur de Thème Dream Frame
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-mono">
              Inspiré du Studio Shopify · Aperçu en direct
            </p>
          </div>
        </div>

        {/* Sélecteur de Viewport (Mobile / Desktop) */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-1 rounded-xl">
          <button
            onClick={() => setViewport('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Vue Desktop</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
              viewport === 'mobile'
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Vue Mobile (375px)</span>
          </button>
        </div>

        {/* Bouton Sauvegarder */}
        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Changements publiés !
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publication...' : 'Enregistrer'}</span>
          </button>
        </div>
      </div>

      {/* ─── DOUBLE PANNEAU (RÉGLAGES À GAUCHE / APERÇU À DROITE) ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ─── PANNEAU LATÉRAL DE RÉGLAGES (380px) ─── */}
        <div className="w-[380px] sm:w-[420px] flex-shrink-0 border-r border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0a] overflow-y-auto p-4 space-y-4 shadow-sm">
          {/* Section 1: Hero & Accès Direct */}
          <div className="border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-neutral-900/40">
            <button
              onClick={() => toggleAccordion('hero')}
              className="w-full p-4 flex items-center justify-between font-semibold text-xs text-left text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800/60 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Type className="w-4 h-4 text-amber-500" />
                <span>Hero & Accès Direct Mobile</span>
              </div>
              {activeAccordion === 'hero' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeAccordion === 'hero' && (
              <div className="p-4 pt-1 space-y-4 border-t border-slate-200 dark:border-neutral-800/80 text-xs">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Titre Principal Hero
                  </label>
                  <textarea
                    rows={2}
                    value={settings.heroTitle || "L'art de la supercar, sculpté en relief 3D."}
                    onChange={(e) => handleChange('heroTitle', e.target.value)}
                    className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Sous-titre explicatif
                  </label>
                  <textarea
                    rows={2}
                    value={settings.heroSubtitle || "Miniatures d'exception sous vitrage haute définition et rétroéclairage LED intégré. 49,99 € TTC avec Livraison 100% Offerte."}
                    onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                    className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Texte du Bouton Produit Vedette (CTA)
                  </label>
                  <input
                    type="text"
                    value={settings.heroCtaText || "Découvrir la Porsche GT3 RS — 49,99 €"}
                    onChange={(e) => handleChange('heroCtaText', e.target.value)}
                    className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Header & Logo */}
          <div className="border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-neutral-900/40">
            <button
              onClick={() => toggleAccordion('header')}
              className="w-full p-4 flex items-center justify-between font-semibold text-xs text-left text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800/60 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Layout className="w-4 h-4 text-amber-500" />
                <span>Header & Disposition Logo</span>
              </div>
              {activeAccordion === 'header' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeAccordion === 'header' && (
              <div className="p-4 pt-1 space-y-4 border-t border-slate-200 dark:border-neutral-800/80 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Position du Logo
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'left', label: 'Gauche' },
                      { id: 'center', label: 'Centre' },
                      { id: 'right', label: 'Droite' },
                    ].map((pos) => (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => handleChange('headerLogoPosition', pos.id)}
                        className={`py-2 px-3 rounded-xl border text-center font-medium transition cursor-pointer ${
                          (settings.headerLogoPosition || 'center') === pos.id
                            ? 'bg-amber-400 border-amber-400 text-black font-bold'
                            : 'bg-white dark:bg-black/50 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300'
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Style Visuel du Header
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'glass', label: 'Fumé Glass' },
                      { id: 'solid', label: 'Noir Plein' },
                      { id: 'gold', label: 'Liseré Doré' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleChange('headerStyle', st.id)}
                        className={`py-2 px-3 rounded-xl border text-center font-medium transition cursor-pointer ${
                          (settings.headerStyle || 'glass') === st.id
                            ? 'bg-amber-400 border-amber-400 text-black font-bold'
                            : 'bg-white dark:bg-black/50 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Barre d'Annonce */}
          <div className="border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-neutral-900/40">
            <button
              onClick={() => toggleAccordion('announcement')}
              className="w-full p-4 flex items-center justify-between font-semibold text-xs text-left text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800/60 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Barre d'Annonce Supérieure</span>
              </div>
              {activeAccordion === 'announcement' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeAccordion === 'announcement' && (
              <div className="p-4 pt-1 space-y-4 border-t border-slate-200 dark:border-neutral-800/80 text-xs">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Activer le bandeau d'annonce
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.announcementBarEnabled ?? true}
                    onChange={(e) => handleChange('announcementBarEnabled', e.target.checked)}
                    className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Texte de l'Annonce
                  </label>
                  <input
                    type="text"
                    value={settings.announcementBarText || 'LIVRAISON COLISSIMO SUIVIE 100% OFFERTE · EXPÉDITION 24/48H'}
                    onChange={(e) => handleChange('announcementBarText', e.target.value)}
                    className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Section Conception & Image Atelier */}
          <div className="border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-neutral-900/40">
            <button
              onClick={() => toggleAccordion('craft')}
              className="w-full p-4 flex items-center justify-between font-semibold text-xs text-left text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800/60 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 text-amber-500" />
                <span>Section Fabrication & Image Atelier</span>
              </div>
              {activeAccordion === 'craft' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeAccordion === 'craft' && (
              <div className="p-4 pt-1 space-y-4 border-t border-slate-200 dark:border-neutral-800/80 text-xs">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Afficher la section Fabrication
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.craftSectionEnabled ?? true}
                    onChange={(e) => handleChange('craftSectionEnabled', e.target.checked)}
                    className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    URL de l'Image Personnalisée d'Atelier
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={settings.craftSectionImage || ''}
                    onChange={(e) => handleChange('craftSectionImage', e.target.value)}
                    className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-slate-400">
                    Renseignez l'URL de votre propre visuel de fabrication d'atelier.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Animations & Effets Lumineux */}
          <div className="border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-neutral-900/40">
            <button
              onClick={() => toggleAccordion('animations')}
              className="w-full p-4 flex items-center justify-between font-semibold text-xs text-left text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800/60 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Animations & Ambiance Lumineuse</span>
              </div>
              {activeAccordion === 'animations' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeAccordion === 'animations' && (
              <div className="p-4 pt-1 space-y-4 border-t border-slate-200 dark:border-neutral-800/80 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Type d'Animation au Défilement
                  </label>
                  <select
                    value={settings.animationsType || 'fade-up'}
                    onChange={(e) => handleChange('animationsType', e.target.value)}
                    className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="fade-up">Fade-Up Doux (Classique Luxe)</option>
                    <option value="hero-zoom">Zoom Immersif Hero</option>
                    <option value="slide-in">Glissement Dynamique</option>
                    <option value="none">Désactivées (Instantané)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Effets d'Auréole Lumineuse (LED Glow)
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.glowEffectsEnabled ?? true}
                    onChange={(e) => handleChange('glowEffectsEnabled', e.target.checked)}
                    className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── APERÇU EN DIRECT DU SITE (RÉACTIVITÉ STYLE SHOPIFY) ─── */}
        <div className="flex-1 bg-slate-200 dark:bg-neutral-950 p-4 sm:p-6 overflow-hidden flex flex-col items-center justify-center relative">
          <div className="text-center mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-neutral-400 font-semibold flex items-center justify-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-500" />
              <span>Aperçu Réel du Site (Mode {viewport === 'mobile' ? 'Mobile' : 'Desktop'})</span>
            </span>
          </div>

          <div
            className={`transition-all duration-300 bg-black rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col ${
              viewport === 'mobile'
                ? 'w-[375px] h-[667px] ring-8 ring-neutral-900 rounded-[36px]'
                : 'w-full h-full max-w-6xl max-h-[85vh]'
            }`}
          >
            <iframe
              key={iframeKey}
              src="/"
              title="Aperçu Dream Frame"
              className="w-full h-full border-none bg-[#080807]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
