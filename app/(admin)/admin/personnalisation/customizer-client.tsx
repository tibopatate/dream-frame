'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Palette,
  Smartphone,
  Tablet,
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
  Pencil,
  Truck,
  ShieldCheck,
  Award,
  Layers,
  ArrowRight,
  ExternalLink,
  Check,
  Box,
} from 'lucide-react'
import { updateCustomizerAction } from './actions'
import type { StoredSettings } from '@/lib/data-store'
import { LiveVisitorsWidget } from '@/components/admin/LiveVisitorsWidget'

interface CustomizerClientProps {
  initialSettings: StoredSettings
}

export function CustomizerClient({ initialSettings }: CustomizerClientProps) {
  const [settings, setSettings] = useState<StoredSettings>(initialSettings)
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [activeAccordion, setActiveAccordion] = useState<string | null>('hero')
  const [selectedField, setSelectedField] = useState<keyof StoredSettings | null>('heroTitle')
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const fieldInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id)
  }

  const handleChange = (key: keyof StoredSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  // Clic sur un élément dans l'aperçu (Style Shopify Click-to-Edit)
  const handleSelectField = (field: keyof StoredSettings, sectionAccordion: string) => {
    setSelectedField(field)
    setActiveAccordion(sectionAccordion)
    setTimeout(() => {
      if (fieldInputRef.current) {
        fieldInputRef.current.focus()
      }
    }, 100)
  }

  const handleSave = async () => {
    setSaving(true)
    setSavedSuccess(false)
    const res = await updateCustomizerAction(settings)
    setSaving(false)
    if (res.success) {
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3500)
    }
  }

  // Réinitialiser aux valeurs d'origine luxe
  const handleReset = () => {
    if (confirm('Réinitialiser tous les textes aux valeurs par défaut de l\'atelier ?')) {
      setSettings(initialSettings)
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-100 dark:bg-black text-slate-900 dark:text-white overflow-hidden select-none">
      {/* ─── 1. BARRE SUPÉRIEURE DE COMMANDE (STUDIO STYLE SHOPIFY) ─── */}
      <header className="h-16 px-4 sm:px-6 border-b border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0a] flex items-center justify-between flex-shrink-0 shadow-sm z-30">
        {/* Titre & Statut */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-500 flex-shrink-0">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-xs sm:text-sm uppercase tracking-wider">
                Éditeur Thème Dream Frame
              </h1>
              <span className="text-[9px] font-mono uppercase bg-amber-400/10 border border-amber-400/20 text-amber-500 px-2 py-0.5 rounded-full font-bold">
                Click &amp; Edit
              </span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-neutral-400 hidden sm:block">
              Cliquez sur n&apos;importe quel élément dans l&apos;aperçu pour le modifier
            </p>
          </div>
        </div>

        {/* ─── WIDGET VISITEURS EN DIRECT (Live Traffic) ─── */}
        <div className="hidden md:flex items-center">
          <LiveVisitorsWidget variant="badge" />
        </div>

        {/* ─── SÉLECTEUR DE VUES APPAREILS (Desktop, Tablette, Mobile) ─── */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            title="Vue Desktop (100%)"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Bureau</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport('tablet')}
            title="Vue Tablette (768px)"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
              viewport === 'tablet'
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Tablette</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport('mobile')}
            title="Vue Mobile iPhone (375px)"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
              viewport === 'mobile'
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Mobile (375px)</span>
          </button>
        </div>

        {/* ─── ACTIONS : RÉINITIALISER & ENREGISTRER / PUBLIER ─── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {savedSuccess && (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Publié en direct !</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleReset}
            title="Réinitialiser"
            className="p-2 sm:px-3 sm:py-2 text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white border border-transparent hover:border-slate-200 dark:hover:border-neutral-800 rounded-xl transition text-xs flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Annuler</span>
          </button>

          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="p-2 sm:px-3 sm:py-2 text-slate-600 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white border border-slate-200 dark:border-neutral-800 rounded-xl transition text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Voir le site</span>
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 sm:px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publication...' : 'Enregistrer'}</span>
          </button>
        </div>
      </header>

      {/* ─── 2. DOUBLE PANNEAU : INSPECTEUR SHOPPY (GAUCHE) / CANVAS DIRECT (DROITE) ─── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ─── PANNEAU LATÉRAL GAUCHE : ARBORESCENCE & ÉDITION (380px) ─── */}
        <aside className="w-[340px] sm:w-[400px] flex-shrink-0 border-r border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0a] overflow-y-auto p-4 space-y-4 shadow-md">
          {/* CARTE RAPIDE : ÉLÉMENT ACTIF SÉLECTIONNÉ */}
          {selectedField && (
            <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/40 space-y-2 shadow-sm animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                  <Pencil className="w-3 h-3" />
                  Élément actif sous votre curseur
                </span>
                <span className="text-[9px] font-mono text-slate-400 dark:text-neutral-400">
                  {selectedField}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-neutral-300 font-medium">
                Modifiez le contenu ci-dessous, le résultat change instantanément dans l&apos;aperçu.
              </p>
            </div>
          )}

          {/* ─── SECTION 1 : BANDEAU D'ANNONCE ─── */}
          <div className="border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-neutral-900/40">
            <button
              type="button"
              onClick={() => toggleAccordion('announcement')}
              className="w-full p-4 flex items-center justify-between font-bold text-xs text-left text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800/60 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Bandeau d&apos;Annonce Supérieur</span>
              </div>
              {activeAccordion === 'announcement' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeAccordion === 'announcement' && (
              <div className="p-4 pt-1 space-y-4 border-t border-slate-200 dark:border-neutral-800/80 text-xs">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Activer le bandeau d&apos;annonce
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
                    Texte du bandeau
                  </label>
                  <input
                    type="text"
                    value={settings.announcementBarText || 'LIVRAISON COLISSIMO SUIVIE 100% OFFERTE · EXPÉDITION 24/48H'}
                    onChange={(e) => handleChange('announcementBarText', e.target.value)}
                    className={`w-full bg-white dark:bg-black/60 border rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400 transition ${
                      selectedField === 'announcementBarText' ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 dark:border-neutral-800'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ─── SECTION 2 : HERO (ACCROCHE PRINCIPALE) ─── */}
          <div className="border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-neutral-900/40">
            <button
              type="button"
              onClick={() => toggleAccordion('hero')}
              className="w-full p-4 flex items-center justify-between font-bold text-xs text-left text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800/60 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Type className="w-4 h-4 text-amber-500" />
                <span>Hero &amp; Titre Principal</span>
              </div>
              {activeAccordion === 'hero' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeAccordion === 'hero' && (
              <div className="p-4 pt-1 space-y-4 border-t border-slate-200 dark:border-neutral-800/80 text-xs">
                {/* Badge Atelier */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Badge Supérieur
                  </label>
                  <input
                    type="text"
                    value={settings.heroBadgeText || 'Atelier Français · Cadres Décoratifs Supercars'}
                    onChange={(e) => handleChange('heroBadgeText', e.target.value)}
                    className={`w-full bg-white dark:bg-black/60 border rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400 transition ${
                      selectedField === 'heroBadgeText' ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 dark:border-neutral-800'
                    }`}
                  />
                </div>

                {/* Titre Principal */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Titre Principal Hero
                  </label>
                  <textarea
                    rows={2}
                    value={settings.heroTitle || "L'art de la supercar, sculpté en relief 3D."}
                    onChange={(e) => handleChange('heroTitle', e.target.value)}
                    className={`w-full bg-white dark:bg-black/60 border rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400 resize-none transition ${
                      selectedField === 'heroTitle' ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 dark:border-neutral-800'
                    }`}
                  />
                </div>

                {/* Sous-titre */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Sous-titre Explicatif
                  </label>
                  <textarea
                    rows={2}
                    value={settings.heroSubtitle || "Cadres d’ébénisterie automobile sous vitrage optique anti-UV avec rétroéclairage LED ambré intégré."}
                    onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                    className={`w-full bg-white dark:bg-black/60 border rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400 resize-none transition ${
                      selectedField === 'heroSubtitle' ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 dark:border-neutral-800'
                    }`}
                  />
                </div>

                {/* Prix d'accroche */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Mention Tarif &amp; Livraison
                  </label>
                  <input
                    type="text"
                    value={settings.heroPriceText || 'À partir de 49,99 € · Livraison Colissimo 100% Offerte.'}
                    onChange={(e) => handleChange('heroPriceText', e.target.value)}
                    className={`w-full bg-white dark:bg-black/60 border rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400 transition ${
                      selectedField === 'heroPriceText' ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 dark:border-neutral-800'
                    }`}
                  />
                </div>

                {/* Bouton CTA 1 */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Libellé Bouton Principal (Catalogue)
                  </label>
                  <input
                    type="text"
                    value={settings.heroCtaPrimaryText || 'Découvrir la Collection'}
                    onChange={(e) => handleChange('heroCtaPrimaryText', e.target.value)}
                    className={`w-full bg-white dark:bg-black/60 border rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400 transition ${
                      selectedField === 'heroCtaPrimaryText' ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 dark:border-neutral-800'
                    }`}
                  />
                </div>

                {/* Bouton CTA 2 */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Libellé Bouton Secondaire (Configurateur)
                  </label>
                  <input
                    type="text"
                    value={settings.heroCtaSecondaryText || 'Créer mon Dream Frame'}
                    onChange={(e) => handleChange('heroCtaSecondaryText', e.target.value)}
                    className={`w-full bg-white dark:bg-black/60 border rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400 transition ${
                      selectedField === 'heroCtaSecondaryText' ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 dark:border-neutral-800'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ─── SECTION 3 : LES 3 PILIERS D'ARCHITECTURE ─── */}
          <div className="border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-neutral-900/40">
            <button
              type="button"
              onClick={() => toggleAccordion('pillars')}
              className="w-full p-4 flex items-center justify-between font-bold text-xs text-left text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800/60 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-amber-500" />
                <span>3 Piliers : Pas un Poster, une Pièce</span>
              </div>
              {activeAccordion === 'pillars' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeAccordion === 'pillars' && (
              <div className="p-4 pt-1 space-y-4 border-t border-slate-200 dark:border-neutral-800/80 text-xs">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Titre de la section
                  </label>
                  <input
                    type="text"
                    value={settings.pillarsTitle || 'Pas un simple poster. Une véritable œuvre murale.'}
                    onChange={(e) => handleChange('pillarsTitle', e.target.value)}
                    className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Pilier 1 */}
                <div className="p-3 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-neutral-800 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-amber-500 uppercase">Pilier 1</span>
                  <input
                    type="text"
                    value={settings.pillar1Value || '25 mm de Profondeur'}
                    onChange={(e) => handleChange('pillar1Value', e.target.value)}
                    placeholder="Valeur mise en avant"
                    className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-2 text-xs"
                  />
                  <input
                    type="text"
                    value={settings.pillar1Title || 'Relief Multi-Couches 3D'}
                    onChange={(e) => handleChange('pillar1Title', e.target.value)}
                    placeholder="Titre"
                    className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-2 text-xs"
                  />
                  <textarea
                    rows={2}
                    value={settings.pillar1Desc || "Le modèle est découpé avec une précision chirurgicale et mis en suspension au-dessus d’un passe-partout biseauté noir mat à 45°."}
                    onChange={(e) => handleChange('pillar1Desc', e.target.value)}
                    placeholder="Description"
                    className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-2 text-xs resize-none"
                  />
                </div>

                {/* Pilier 2 */}
                <div className="p-3 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-neutral-800 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-amber-500 uppercase">Pilier 2</span>
                  <input
                    type="text"
                    value={settings.pillar2Value || 'Blanc Chaud 3000K'}
                    onChange={(e) => handleChange('pillar2Value', e.target.value)}
                    placeholder="Valeur mise en avant"
                    className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-2 text-xs"
                  />
                  <input
                    type="text"
                    value={settings.pillar2Title || 'Rétroéclairage LED Intégré'}
                    onChange={(e) => handleChange('pillar2Title', e.target.value)}
                    placeholder="Titre"
                    className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-2 text-xs"
                  />
                  <textarea
                    rows={2}
                    value={settings.pillar2Desc || "Un ruban micro-LED haute fidélité baigne délicatement les arêtes de la carrosserie d’une lueur feutrée, parfaite pour tamiser vos soirées."}
                    onChange={(e) => handleChange('pillar2Desc', e.target.value)}
                    placeholder="Description"
                    className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-2 text-xs resize-none"
                  />
                </div>

                {/* Pilier 3 */}
                <div className="p-3 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-neutral-800 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-amber-500 uppercase">Pilier 3</span>
                  <input
                    type="text"
                    value={settings.pillar3Value || 'Papier Canson 310g/m²'}
                    onChange={(e) => handleChange('pillar3Value', e.target.value)}
                    placeholder="Valeur mise en avant"
                    className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-2 text-xs"
                  />
                  <input
                    type="text"
                    value={settings.pillar3Title || 'Finition Musée & Acrylique HD'}
                    onChange={(e) => handleChange('pillar3Title', e.target.value)}
                    placeholder="Titre"
                    className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-2 text-xs"
                  />
                  <textarea
                    rows={2}
                    value={settings.pillar3Desc || "Impression giclée pigmentaire inaltérable, châssis aluminium anodisé noir et vitrage acrylique haute transparence 99% anti-UV."}
                    onChange={(e) => handleChange('pillar3Desc', e.target.value)}
                    placeholder="Description"
                    className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-2 text-xs resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ─── SECTION 4 : ENGAGEMENTS & RÉASSURANCE ─── */}
          <div className="border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-neutral-900/40">
            <button
              type="button"
              onClick={() => toggleAccordion('reassurance')}
              className="w-full p-4 flex items-center justify-between font-bold text-xs text-left text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800/60 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Blocs de Réassurance (4 Engagements)</span>
              </div>
              {activeAccordion === 'reassurance' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeAccordion === 'reassurance' && (
              <div className="p-4 pt-1 space-y-4 border-t border-slate-200 dark:border-neutral-800/80 text-xs">
                {/* Reassurance 1 */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Engagement 1 (Livraison)
                  </label>
                  <input
                    type="text"
                    value={settings.reassurance1Title || 'Livraison 100% Offerte'}
                    onChange={(e) => handleChange('reassurance1Title', e.target.value)}
                    className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl p-2 text-xs"
                  />
                  <input
                    type="text"
                    value={settings.reassurance1Desc || 'Colissimo Suivi 48h en France avec emballage renforcé anti-choc.'}
                    onChange={(e) => handleChange('reassurance1Desc', e.target.value)}
                    className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl p-2 text-xs text-slate-500"
                  />
                </div>

                {/* Reassurance 2 */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Engagement 2 (Retours)
                  </label>
                  <input
                    type="text"
                    value={settings.reassurance2Title || 'Droit de Rétractation 14 Jours'}
                    onChange={(e) => handleChange('reassurance2Title', e.target.value)}
                    className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl p-2 text-xs"
                  />
                  <input
                    type="text"
                    value={settings.reassurance2Desc || 'Retour simple et sécurisé conformément à la législation française.'}
                    onChange={(e) => handleChange('reassurance2Desc', e.target.value)}
                    className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl p-2 text-xs text-slate-500"
                  />
                </div>

                {/* Reassurance 3 */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Engagement 3 (LEDs &amp; Accessoires)
                  </label>
                  <input
                    type="text"
                    value={settings.reassurance3Title || 'LED & Fixations Incluses'}
                    onChange={(e) => handleChange('reassurance3Title', e.target.value)}
                    className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl p-2 text-xs"
                  />
                  <input
                    type="text"
                    value={settings.reassurance3Desc || 'Chaque pièce arrive prête à poser sur un meuble ou à accrocher au mur.'}
                    onChange={(e) => handleChange('reassurance3Desc', e.target.value)}
                    className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl p-2 text-xs text-slate-500"
                  />
                </div>

                {/* Reassurance 4 */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Engagement 4 (Contrôle Atelier)
                  </label>
                  <input
                    type="text"
                    value={settings.reassurance4Title || 'Manufacture & Contrôle Unitaire'}
                    onChange={(e) => handleChange('reassurance4Title', e.target.value)}
                    className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl p-2 text-xs"
                  />
                  <input
                    type="text"
                    value={settings.reassurance4Desc || 'Chaque cadre est inspecté individuellement avant son expédition.'}
                    onChange={(e) => handleChange('reassurance4Desc', e.target.value)}
                    className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl p-2 text-xs text-slate-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ─── SECTION 5 : INVITATION ATELIER SUR-MESURE ─── */}
          <div className="border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-neutral-900/40">
            <button
              type="button"
              onClick={() => toggleAccordion('configurator')}
              className="w-full p-4 flex items-center justify-between font-bold text-xs text-left text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800/60 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Box className="w-4 h-4 text-amber-500" />
                <span>Invitation Atelier Sur-Mesure</span>
              </div>
              {activeAccordion === 'configurator' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeAccordion === 'configurator' && (
              <div className="p-4 pt-1 space-y-4 border-t border-slate-200 dark:border-neutral-800/80 text-xs">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Titre d&apos;appel
                  </label>
                  <input
                    type="text"
                    value={settings.configuratorCtaTitle || 'Un modèle précis ? Une échelle spécifique ?'}
                    onChange={(e) => handleChange('configuratorCtaTitle', e.target.value)}
                    className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Description explicative
                  </label>
                  <textarea
                    rows={2}
                    value={settings.configuratorCtaDesc || "Composez votre cadre idéal : dimensions (A4, A3, A2), modèle automobile et échelle miniature. Notre configurateur live vous permet de visualiser votre projet instantanément."}
                    onChange={(e) => handleChange('configuratorCtaDesc', e.target.value)}
                    className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    Libellé du Bouton
                  </label>
                  <input
                    type="text"
                    value={settings.configuratorCtaButton || "Accéder à l'Atelier Sur-Mesure"}
                    onChange={(e) => handleChange('configuratorCtaButton', e.target.value)}
                    className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ─── 3. CANVAS CENTRAL : APERÇU INTERACTIF AVEC CLICK-TO-EDIT EN DIRECT ─── */}
        <main className="flex-1 bg-slate-200 dark:bg-[#070706] p-3 sm:p-6 overflow-hidden flex flex-col items-center justify-center relative">
          <div className="text-center mb-2 flex items-center justify-between w-full max-w-6xl px-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-neutral-400 font-semibold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-500" />
              <span>Aperçu Interactif en Temps Réel ({viewport.toUpperCase()})</span>
            </span>
            <span className="text-[10px] font-mono text-amber-500 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              💡 Cliquez sur n&apos;importe quel texte ou bouton pour le modifier
            </span>
          </div>

          {/* Cadre de simulation Viewport */}
          <div
            className={`transition-all duration-300 bg-[#080807] overflow-y-auto shadow-2xl border border-neutral-800 relative select-text ${
              viewport === 'mobile'
                ? 'w-[375px] h-[720px] rounded-[36px] ring-8 ring-neutral-900 shadow-2xl'
                : viewport === 'tablet'
                ? 'w-[768px] h-[80vh] rounded-2xl ring-4 ring-neutral-900'
                : 'w-full h-full max-w-6xl max-h-[85vh] rounded-2xl'
            }`}
          >
            {/* ─── BANDEAU D'ANNONCE INTERACTIF ─── */}
            {(settings.announcementBarEnabled ?? true) && (
              <div
                onClick={() => handleSelectField('announcementBarText', 'announcement')}
                className={`w-full py-2 text-center text-[10px] sm:text-xs font-mono tracking-widest uppercase cursor-pointer relative group transition-all ${
                  selectedField === 'announcementBarText'
                    ? 'bg-amber-400 text-black font-bold ring-2 ring-amber-300 z-20'
                    : 'bg-[#121210] text-amber-400 hover:outline hover:outline-1 hover:outline-amber-400'
                }`}
              >
                <div className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[8px] px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Pencil className="w-2.5 h-2.5 text-amber-400" /> Modifier
                </div>
                {settings.announcementBarText || 'LIVRAISON COLISSIMO SUIVIE 100% OFFERTE · EXPÉDITION 24/48H'}
              </div>
            )}

            {/* ─── HEADER SIMULÉ ─── */}
            <div className="px-6 py-4 border-b border-neutral-800/80 bg-black/60 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <span className="font-serif font-bold text-base text-white tracking-widest uppercase">
                  DREAM FRAME
                </span>
                <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest hidden sm:inline">
                  Atelier France
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-neutral-300 font-medium">
                <span>La Collection</span>
                <span>L&apos;Atelier</span>
                <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] text-amber-400">
                  Panier (0)
                </span>
              </div>
            </div>

            {/* ─── HERO INTERACTIF ─── */}
            <div className="relative py-16 px-6 text-center space-y-5 overflow-hidden">
              {/* Image d'arrière-plan avec fondu */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/90 to-[#080807]">
                <Image
                  src={settings.heroImage || '/atelier/chiron-wall.jpg'}
                  alt="Hero Background"
                  fill
                  className="object-cover opacity-35 filter contrast-125"
                />
              </div>

              {/* Badge Atelier cliquable */}
              <div
                onClick={() => handleSelectField('heroBadgeText', 'hero')}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] cursor-pointer group relative transition-all ${
                  selectedField === 'heroBadgeText'
                    ? 'bg-amber-400 text-black font-bold ring-2 ring-amber-300'
                    : 'bg-black/80 text-amber-400 border border-neutral-800 hover:outline hover:outline-1 hover:outline-amber-400'
                }`}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-amber-400 text-[8px] px-1.5 py-0.5 rounded shadow flex items-center gap-1 border border-neutral-700">
                  <Pencil className="w-2.5 h-2.5" /> Modifier Badge
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {settings.heroBadgeText || 'Atelier Français · Cadres Décoratifs Supercars'}
              </div>

              {/* Titre Principal cliquable */}
              <div
                onClick={() => handleSelectField('heroTitle', 'hero')}
                className={`relative group cursor-pointer max-w-4xl mx-auto transition-all p-2 rounded-xl ${
                  selectedField === 'heroTitle'
                    ? 'ring-2 ring-amber-400 bg-amber-400/5'
                    : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-amber-400/80'
                }`}
              >
                <div className="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-400 text-black text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 z-30">
                  <Pencil className="w-2.5 h-2.5" /> Modifier Titre
                </div>
                <h1 className="text-2xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
                  {settings.heroTitle || "L'art de la supercar, sculpté en relief 3D."}
                </h1>
              </div>

              {/* Sous-titre cliquable */}
              <div
                onClick={() => handleSelectField('heroSubtitle', 'hero')}
                className={`relative group cursor-pointer max-w-2xl mx-auto transition-all p-2 rounded-xl ${
                  selectedField === 'heroSubtitle'
                    ? 'ring-2 ring-amber-400 bg-amber-400/5'
                    : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-amber-400/80'
                }`}
              >
                <div className="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-400 text-black text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 z-30">
                  <Pencil className="w-2.5 h-2.5" /> Modifier Sous-titre
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                  {settings.heroSubtitle || "Cadres d’ébénisterie automobile sous vitrage optique anti-UV avec rétroéclairage LED ambré intégré."}
                </p>
              </div>

              {/* Prix & Livraison cliquable */}
              <div
                onClick={() => handleSelectField('heroPriceText', 'hero')}
                className={`relative group cursor-pointer inline-block transition-all p-1.5 rounded-lg ${
                  selectedField === 'heroPriceText'
                    ? 'ring-2 ring-amber-400 bg-amber-400/10'
                    : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-amber-400/80'
                }`}
              >
                <span className="text-xs sm:text-sm font-semibold text-amber-400 font-mono">
                  {settings.heroPriceText || 'À partir de 49,99 € · Livraison Colissimo 100% Offerte.'}
                </span>
              </div>

              {/* Boutons CTA cliquables */}
              <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
                {/* CTA 1 */}
                <div
                  onClick={() => handleSelectField('heroCtaPrimaryText', 'hero')}
                  className={`relative group cursor-pointer px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 ${
                    selectedField === 'heroCtaPrimaryText' ? 'ring-2 ring-amber-400 scale-105' : 'hover:scale-[1.02]'
                  }`}
                >
                  <div className="absolute -top-3 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-400 text-black text-[8px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                    Modifier CTA 1
                  </div>
                  <span>{settings.heroCtaPrimaryText || 'Découvrir la Collection'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>

                {/* CTA 2 */}
                <div
                  onClick={() => handleSelectField('heroCtaSecondaryText', 'hero')}
                  className={`relative group cursor-pointer px-6 py-3 bg-neutral-900 border border-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 ${
                    selectedField === 'heroCtaSecondaryText' ? 'ring-2 ring-amber-400 scale-105' : 'hover:scale-[1.02]'
                  }`}
                >
                  <div className="absolute -top-3 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-400 text-black text-[8px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                    Modifier CTA 2
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{settings.heroCtaSecondaryText || 'Créer mon Dream Frame'}</span>
                </div>
              </div>
            </div>

            {/* ─── LES 3 PILIERS INTERACTIFS ─── */}
            <div className="py-12 px-6 border-t border-neutral-800 bg-[#0e0e0c]/60 space-y-6">
              <div
                onClick={() => handleSelectField('pillarsTitle', 'pillars')}
                className={`text-center space-y-1 cursor-pointer group relative p-2 rounded-xl ${
                  selectedField === 'pillarsTitle' ? 'ring-2 ring-amber-400' : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-amber-400/80'
                }`}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-400 text-black text-[8px] font-mono font-bold px-1.5 py-0.5 rounded">
                  Modifier Titre Piliers
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {settings.pillarsTitle || 'Pas un simple poster. Une véritable œuvre murale.'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pilier 1 */}
                <div
                  onClick={() => handleSelectField('pillar1Title', 'pillars')}
                  className={`p-5 rounded-xl bg-neutral-900/80 border cursor-pointer group relative transition-all ${
                    selectedField === 'pillar1Title' ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">
                    {settings.pillar1Value || '25 mm de Profondeur'}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">
                    {settings.pillar1Title || 'Relief Multi-Couches 3D'}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light mt-1 line-clamp-2">
                    {settings.pillar1Desc || 'Découpe laser micronique et passe-partout 45°.'}
                  </p>
                </div>

                {/* Pilier 2 */}
                <div
                  onClick={() => handleSelectField('pillar2Title', 'pillars')}
                  className={`p-5 rounded-xl bg-neutral-900/80 border cursor-pointer group relative transition-all ${
                    selectedField === 'pillar2Title' ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">
                    {settings.pillar2Value || 'Blanc Chaud 3000K'}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">
                    {settings.pillar2Title || 'Rétroéclairage LED Intégré'}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light mt-1 line-clamp-2">
                    {settings.pillar2Desc || 'Lueur douce d\'ambiance sans jamais éblouir.'}
                  </p>
                </div>

                {/* Pilier 3 */}
                <div
                  onClick={() => handleSelectField('pillar3Title', 'pillars')}
                  className={`p-5 rounded-xl bg-neutral-900/80 border cursor-pointer group relative transition-all ${
                    selectedField === 'pillar3Title' ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">
                    {settings.pillar3Value || 'Papier Canson 310g/m²'}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">
                    {settings.pillar3Title || 'Finition Musée & Acrylique HD'}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light mt-1 line-clamp-2">
                    {settings.pillar3Desc || 'Impression giclée pigmentaire inaltérable.'}
                  </p>
                </div>
              </div>
            </div>

            {/* ─── BLOC RÉASSURANCE INTERACTIF ─── */}
            <div className="py-8 px-6 border-t border-neutral-800 bg-neutral-950 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                onClick={() => handleSelectField('reassurance1Title', 'reassurance')}
                className={`p-3 rounded-xl border cursor-pointer group transition-all ${
                  selectedField === 'reassurance1Title' ? 'border-amber-400 ring-1 ring-amber-400' : 'border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <Truck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white mt-1">
                  {settings.reassurance1Title || 'Livraison 100% Offerte'}
                </h4>
                <p className="text-[10px] text-neutral-400 font-light mt-0.5 line-clamp-1">
                  {settings.reassurance1Desc || 'Colissimo 48h suivi'}
                </p>
              </div>

              <div
                onClick={() => handleSelectField('reassurance2Title', 'reassurance')}
                className={`p-3 rounded-xl border cursor-pointer group transition-all ${
                  selectedField === 'reassurance2Title' ? 'border-amber-400 ring-1 ring-amber-400' : 'border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white mt-1">
                  {settings.reassurance2Title || 'Retours 14 Jours'}
                </h4>
                <p className="text-[10px] text-neutral-400 font-light mt-0.5 line-clamp-1">
                  {settings.reassurance2Desc || 'Droit de rétractation légal'}
                </p>
              </div>

              <div
                onClick={() => handleSelectField('reassurance3Title', 'reassurance')}
                className={`p-3 rounded-xl border cursor-pointer group transition-all ${
                  selectedField === 'reassurance3Title' ? 'border-amber-400 ring-1 ring-amber-400' : 'border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white mt-1">
                  {settings.reassurance3Title || 'LED & Fixations Incluses'}
                </h4>
                <p className="text-[10px] text-neutral-400 font-light mt-0.5 line-clamp-1">
                  {settings.reassurance3Desc || 'Prêt à poser ou fixer'}
                </p>
              </div>

              <div
                onClick={() => handleSelectField('reassurance4Title', 'reassurance')}
                className={`p-3 rounded-xl border cursor-pointer group transition-all ${
                  selectedField === 'reassurance4Title' ? 'border-amber-400 ring-1 ring-amber-400' : 'border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <Award className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white mt-1">
                  {settings.reassurance4Title || 'Contrôle Unitaire'}
                </h4>
                <p className="text-[10px] text-neutral-400 font-light mt-0.5 line-clamp-1">
                  {settings.reassurance4Desc || 'Inspecté en atelier France'}
                </p>
              </div>
            </div>

            {/* ─── APPEL CONFIGURATEUR INTERACTIF ─── */}
            <div
              onClick={() => handleSelectField('configuratorCtaTitle', 'configurator')}
              className={`p-8 border-t border-neutral-800 bg-neutral-900/60 text-center space-y-3 cursor-pointer group transition-all ${
                selectedField === 'configuratorCtaTitle' ? 'ring-2 ring-amber-400' : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-amber-400/80'
              }`}
            >
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold block">
                Atelier Sur-Mesure
              </span>
              <h3 className="text-xl font-bold text-white">
                {settings.configuratorCtaTitle || 'Un modèle précis ? Une échelle spécifique ?'}
              </h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto font-light line-clamp-2">
                {settings.configuratorCtaDesc || 'Composez votre cadre idéal : dimensions, modèle et échelle miniature.'}
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{settings.configuratorCtaButton || "Accéder à l'Atelier Sur-Mesure"}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
