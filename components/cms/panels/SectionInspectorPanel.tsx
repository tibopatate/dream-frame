'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Type,
  Palette,
  LayoutGrid,
  Sparkles,
  Smartphone,
  Settings2,
  ChevronDown,
  ChevronRight,
  Trash2,
} from 'lucide-react'
import { ProductImageUploader } from '@/components/admin/ProductImageUploader'
import type { PageSection } from '@/lib/page-builder/types'

interface SectionInspectorPanelProps {
  section: PageSection
  onBack: () => void
  onUpdateSettings: (sectionId: string, updates: Record<string, any>) => void
  onDeleteSection: (sectionId: string) => void
}

const TABS = [
  { id: 'content', label: 'Contenu', icon: Type },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'layout', label: 'Layout', icon: LayoutGrid },
  { id: 'animation', label: 'Animation', icon: Sparkles },
  { id: 'responsive', label: 'Responsive', icon: Smartphone },
  { id: 'advanced', label: 'Avancé', icon: Settings2 },
]

function FieldGroup({ label, children, helpText }: { label: string; children: React.ReactNode; helpText?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">{label}</label>
      {children}
      {helpText && <p className="text-[10px] text-slate-400 leading-tight">{helpText}</p>}
    </div>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
  multiline,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  multiline?: boolean
}) {
  const cls = 'w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition'
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={cls + ' resize-none'}
      />
    )
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cls}
    />
  )
}

function AccordionSection({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen ?? true)
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-xs font-bold text-slate-700 hover:text-slate-900 transition cursor-pointer"
      >
        <span>{title}</span>
        {open ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
      </button>
      {open && <div className="pb-4 space-y-3">{children}</div>}
    </div>
  )
}

// ─── Hero Section Content ────────────────────────────────────────────
function HeroContentFields({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  return (
    <>
      <AccordionSection title="Textes du Hero" defaultOpen>
        <FieldGroup label="Accroche / Badge">
          <TextInput value={s.badgeText || ''} onChange={(v) => onChange('badgeText', v)} placeholder="L'ART DE CAPTURER" />
        </FieldGroup>
        <FieldGroup label="Titre principal">
          <TextInput value={s.title || ''} onChange={(v) => onChange('title', v)} placeholder="L'EXCEPTIONNEL" />
        </FieldGroup>
        <FieldGroup label="Sous-titre / Description">
          <TextInput value={s.subtitle || ''} onChange={(v) => onChange('subtitle', v)} placeholder="Des voitures de légende, encadrées pour l'éternité." multiline />
        </FieldGroup>
      </AccordionSection>

      <AccordionSection title="Boutons d'action" defaultOpen>
        <FieldGroup label="Bouton principal — Texte">
          <TextInput value={s.primaryBtnText || ''} onChange={(v) => onChange('primaryBtnText', v)} placeholder="VISITER NOTRE GALERIE" />
        </FieldGroup>
        <FieldGroup label="Bouton principal — Lien">
          <TextInput value={s.primaryBtnLink || ''} onChange={(v) => onChange('primaryBtnLink', v)} placeholder="/catalogue" />
        </FieldGroup>
        <FieldGroup label="Bouton secondaire — Texte">
          <TextInput value={s.secondaryBtnText || ''} onChange={(v) => onChange('secondaryBtnText', v)} placeholder="DÉCOUVRIR L'ATELIER" />
        </FieldGroup>
        <FieldGroup label="Bouton secondaire — Lien">
          <TextInput value={s.secondaryBtnLink || ''} onChange={(v) => onChange('secondaryBtnLink', v)} placeholder="/configurateur" />
        </FieldGroup>
      </AccordionSection>

      <AccordionSection title="Photographie d'arrière-plan" defaultOpen>
        <FieldGroup label="Image de fond principale du Hero Showroom">
          <ProductImageUploader
            images={s.bgImage ? [s.bgImage] : []}
            onChange={(imgs) => onChange('bgImage', imgs[0] || '')}
            maxImages={1}
          />
        </FieldGroup>
      </AccordionSection>
    </>
  )
}

// ─── Collection Section Content ──────────────────────────────────────
function CollectionContentFields({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  return (
    <AccordionSection title="Affichage de la collection" defaultOpen>
      <FieldGroup label="Titre de la section">
        <TextInput value={s.title || ''} onChange={(v) => onChange('title', v)} placeholder="NOTRE COLLECTION" />
      </FieldGroup>
      <FieldGroup label="Sous-titre">
        <TextInput value={s.subtitle || ''} onChange={(v) => onChange('subtitle', v)} placeholder="Des légendes, une seule passion" />
      </FieldGroup>
      <FieldGroup label="Catégorie affichée">
        <select
          value={s.category || 'ALL'}
          onChange={(e) => onChange('category', e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
        >
          <option value="ALL">Toutes les époques (Toutes supercars)</option>
          <option value="VINTAGE">Époque Vintage / Iconiques</option>
          <option value="MODERN">Époque Moderne &amp; Hypercars</option>
        </select>
      </FieldGroup>
      <FieldGroup label="Nombre de cadres à présenter">
        <select
          value={s.limit || 4}
          onChange={(e) => onChange('limit', Number(e.target.value))}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
        >
          <option value={4}>4 Cadres (1 rangée)</option>
          <option value={8}>8 Cadres (2 rangées)</option>
          <option value={12}>12 Cadres (Collection complète)</option>
        </select>
      </FieldGroup>
    </AccordionSection>
  )
}

// ─── Craft Section Content ───────────────────────────────────────────
function CraftContentFields({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  return (
    <AccordionSection title="Savoir-Faire &amp; Anatomie" defaultOpen>
      <FieldGroup label="Titre de la section">
        <TextInput value={s.title || ''} onChange={(v) => onChange('title', v)} placeholder="L'Anatomie d'une Pièce d'Exception" />
      </FieldGroup>
      <FieldGroup label="Sous-titre / Description">
        <TextInput value={s.subtitle || ''} onChange={(v) => onChange('subtitle', v)} placeholder="5 couches de perfection pour donner vie à la légende." multiline />
      </FieldGroup>
    </AccordionSection>
  )
}

// ─── Custom Atelier Content ──────────────────────────────────────────
function AtelierContentFields({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  return (
    <AccordionSection title="Atelier Sur-Mesure" defaultOpen>
      <FieldGroup label="Badge supérieur">
        <TextInput value={s.badge || ''} onChange={(v) => onChange('badge', v)} placeholder="Configuration Personnalisée" />
      </FieldGroup>
      <FieldGroup label="Titre">
        <TextInput value={s.title || ''} onChange={(v) => onChange('title', v)} placeholder="Un modèle précis ? Une échelle spécifique ?" />
      </FieldGroup>
      <FieldGroup label="Description">
        <TextInput value={s.desc || ''} onChange={(v) => onChange('desc', v)} placeholder="Composez votre cadre idéal : dimensions (A4, A3, A2), modèle automobile..." multiline />
      </FieldGroup>
      <FieldGroup label="Texte du bouton">
        <TextInput value={s.btnText || ''} onChange={(v) => onChange('btnText', v)} placeholder="Accéder à l'Atelier Sur-Mesure" />
      </FieldGroup>
      <FieldGroup label="Lien du bouton">
        <TextInput value={s.btnLink || ''} onChange={(v) => onChange('btnLink', v)} placeholder="/configurateur" />
      </FieldGroup>
    </AccordionSection>
  )
}

// ─── Interiors Content ───────────────────────────────────────────────
function InteriorsContentFields({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  return (
    <AccordionSection title="Mise en Situation Intérieure" defaultOpen>
      <FieldGroup label="Titre de la section">
        <TextInput value={s.title || ''} onChange={(v) => onChange('title', v)} placeholder="Laissez-les sublimer votre pièce" />
      </FieldGroup>
      <FieldGroup label="Sous-titre">
        <TextInput value={s.subtitle || ''} onChange={(v) => onChange('subtitle', v)} placeholder="Du salon contemporain au bureau de direction..." />
      </FieldGroup>
      <div className="space-y-2 pt-2">
        <p className="text-[11px] font-bold text-slate-700">Images d&apos;ambiance</p>
        <FieldGroup label="Image 1 (ex: Salon moderne)">
          <TextInput value={s.img1 || ''} onChange={(v) => onChange('img1', v)} placeholder="/images/interiors-1.jpg" />
        </FieldGroup>
        <FieldGroup label="Image 2 (ex: Bureau exécutif)">
          <TextInput value={s.img2 || ''} onChange={(v) => onChange('img2', v)} placeholder="/images/interiors-2.jpg" />
        </FieldGroup>
        <FieldGroup label="Image 3 (ex: Suite prestige)">
          <TextInput value={s.img3 || ''} onChange={(v) => onChange('img3', v)} placeholder="/images/interiors-3.jpg" />
        </FieldGroup>
      </div>
    </AccordionSection>
  )
}

// ─── Reassurance Content ─────────────────────────────────────────────
function ReassuranceContentFields({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  return (
    <AccordionSection title="Engagements &amp; Garanties" defaultOpen>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg space-y-1.5">
          <FieldGroup label={`Engagement ${i} — Titre`}>
            <TextInput value={s[`item${i}Title`] || ''} onChange={(v) => onChange(`item${i}Title`, v)} placeholder={`Garantie ${i}`} />
          </FieldGroup>
          <FieldGroup label={`Engagement ${i} — Description`}>
            <TextInput value={s[`item${i}Desc`] || ''} onChange={(v) => onChange(`item${i}Desc`, v)} placeholder="Description de l'engagement..." />
          </FieldGroup>
        </div>
      ))}
    </AccordionSection>
  )
}

// ─── Demo 3D Content ─────────────────────────────────────────────────
function DemoContentFields({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  return (
    <AccordionSection title="Module 3D Interactif" defaultOpen>
      <FieldGroup label="Badge">
        <TextInput value={s.badge || ''} onChange={(v) => onChange('badge', v)} placeholder="Démonstrateur Interactif" />
      </FieldGroup>
      <FieldGroup label="Titre">
        <TextInput value={s.title || ''} onChange={(v) => onChange('title', v)} placeholder="Admirez chaque détail sous tous les angles" />
      </FieldGroup>
      <FieldGroup label="Description">
        <TextInput value={s.desc || ''} onChange={(v) => onChange('desc', v)} placeholder="Module de prévisualisation avec éclairage LED ajustable." multiline />
      </FieldGroup>
    </AccordionSection>
  )
}

// ─── About Content ───────────────────────────────────────────────────
function AboutContentFields({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  return (
    <AccordionSection title="Qui sommes-nous" defaultOpen>
      <FieldGroup label="Titre">
        <TextInput value={s.title || ''} onChange={(v) => onChange('title', v)} placeholder="Qui sommes-nous ?" />
      </FieldGroup>
      <FieldGroup label="Paragraphe 1">
        <TextInput value={s.p1 || ''} onChange={(v) => onChange('p1', v)} multiline />
      </FieldGroup>
      <FieldGroup label="Paragraphe 2">
        <TextInput value={s.p2 || ''} onChange={(v) => onChange('p2', v)} multiline />
      </FieldGroup>
    </AccordionSection>
  )
}

// ─── FAQ Content ─────────────────────────────────────────────────────
function FAQContentFields({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  return (
    <AccordionSection title="Questions fréquentes" defaultOpen>
      <FieldGroup label="Titre de la section">
        <TextInput value={s.title || ''} onChange={(v) => onChange('title', v)} placeholder="Questions Fréquentes" />
      </FieldGroup>
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-1.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
          <FieldGroup label={`Question ${i}`}>
            <TextInput value={s[`q${i}`] || ''} onChange={(v) => onChange(`q${i}`, v)} placeholder={`Question ${i}...`} />
          </FieldGroup>
          <FieldGroup label={`Réponse ${i}`}>
            <TextInput value={s[`a${i}`] || ''} onChange={(v) => onChange(`a${i}`, v)} multiline placeholder={`Réponse ${i}...`} />
          </FieldGroup>
        </div>
      ))}
    </AccordionSection>
  )
}

// ─── Generic Content Fields ──────────────────────────────────────────
function GenericContentFields({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  return (
    <AccordionSection title="Contenu de la section" defaultOpen>
      <FieldGroup label="Titre">
        <TextInput value={s.title || ''} onChange={(v) => onChange('title', v)} placeholder="Titre de la section" />
      </FieldGroup>
      <FieldGroup label="Description">
        <TextInput value={s.desc || ''} onChange={(v) => onChange('desc', v)} multiline placeholder="Description..." />
      </FieldGroup>
    </AccordionSection>
  )
}

// ─── Design Tab ──────────────────────────────────────────────────────
function DesignTab({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  const bgOptions = [
    { label: 'Sombre Studio (#080807)', value: '#080807' },
    { label: 'Noir Pur (#000000)', value: '#000000' },
    { label: 'Anthracite (#0c0c0a)', value: '#0c0c0a' },
    { label: 'Gris Profond (#18181b)', value: '#18181b' },
  ]

  return (
    <div className="space-y-3 py-1">
      <AccordionSection title="Couleur de fond" defaultOpen>
        <FieldGroup label="Fond de la section">
          <div className="grid grid-cols-2 gap-2">
            {bgOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange('bgColor', opt.value)}
                className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition cursor-pointer ${
                  (s.bgColor || '#080807') === opt.value
                    ? 'border-red-500 bg-red-50/20 text-slate-900 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex-shrink-0" style={{ backgroundColor: opt.value }} />
                <span className="truncate">{opt.label}</span>
              </button>
            ))}
          </div>
        </FieldGroup>
      </AccordionSection>

      <AccordionSection title="Contraste &amp; Éclairage" defaultOpen>
        <FieldGroup label="Filtre d'assombrissement (Overlay Vignette)">
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-slate-600">Intensité</span>
            <span className="text-xs font-mono text-slate-500">{s.overlayOpacity ?? 80}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={s.overlayOpacity ?? 80}
            onChange={(e) => onChange('overlayOpacity', Number(e.target.value))}
            className="w-full accent-red-600"
          />
        </FieldGroup>
      </AccordionSection>
    </div>
  )
}

// ─── Layout Tab ──────────────────────────────────────────────────────
function LayoutTab({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  const paddingOptions = [
    { label: 'Compact (py-12)', value: 'py-12' },
    { label: 'Standard (py-20)', value: 'py-20' },
    { label: 'Aéré (py-32)', value: 'py-32' },
  ]

  const widthOptions = [
    { label: 'Standard (max-w-6xl)', value: 'max-w-6xl' },
    { label: 'Large (max-w-7xl)', value: 'max-w-7xl' },
    { label: 'Plein écran (100%)', value: 'w-full' },
  ]

  return (
    <div className="space-y-3 py-1">
      <AccordionSection title="Espacement Vertical" defaultOpen>
        <FieldGroup label="Hauteur de rembourrage">
          <div className="grid grid-cols-3 gap-1.5">
            {paddingOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange('paddingVertical', opt.value)}
                className={`py-2 px-2 text-center rounded-lg border text-xs transition cursor-pointer ${
                  (s.paddingVertical || 'py-20') === opt.value
                    ? 'border-red-500 bg-red-50 text-red-600 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {opt.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </FieldGroup>
      </AccordionSection>

      <AccordionSection title="Largeur du Contenu" defaultOpen>
        <FieldGroup label="Conteneur">
          <div className="space-y-1">
            {widthOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange('containerWidth', opt.value)}
                className={`w-full py-2 px-3 text-left rounded-lg border text-xs transition cursor-pointer flex items-center justify-between ${
                  (s.containerWidth || 'max-w-6xl') === opt.value
                    ? 'border-red-500 bg-red-50 text-red-600 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{opt.label}</span>
                {(s.containerWidth || 'max-w-6xl') === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-red-600" />}
              </button>
            ))}
          </div>
        </FieldGroup>
      </AccordionSection>
    </div>
  )
}

// ─── Animation Tab ───────────────────────────────────────────────────
function AnimationTab({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  const anims = [
    { label: 'Fondu doux (Fade)', value: 'fade' },
    { label: 'Montée progressive (Slide Up)', value: 'slide-up' },
    { label: 'Zoom subtil (Zoom In)', value: 'zoom-in' },
  ]

  return (
    <div className="space-y-3 py-1">
      <AccordionSection title="Effets d'apparition" defaultOpen>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-slate-700 font-medium">Activer l&apos;animation au scroll</span>
          <button
            type="button"
            onClick={() => onChange('animateEntrance', !s.animateEntrance)}
            className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
              s.animateEntrance !== false ? 'bg-red-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                s.animateEntrance !== false ? 'translate-x-4.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        <FieldGroup label="Type d'animation">
          <div className="space-y-1 pt-1">
            {anims.map((a) => (
              <button
                key={a.value}
                type="button"
                onClick={() => onChange('animationType', a.value)}
                className={`w-full py-2 px-3 text-left rounded-lg border text-xs transition cursor-pointer flex items-center justify-between ${
                  (s.animationType || 'slide-up') === a.value
                    ? 'border-red-500 bg-red-50 text-red-600 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{a.label}</span>
                {(s.animationType || 'slide-up') === a.value && <span className="w-1.5 h-1.5 rounded-full bg-red-600" />}
              </button>
            ))}
          </div>
        </FieldGroup>
      </AccordionSection>
    </div>
  )
}

// ─── Responsive Tab ──────────────────────────────────────────────────
function ResponsiveTab({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  return (
    <div className="space-y-3 py-1">
      <AccordionSection title="Visibilité par écran" defaultOpen>
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-800">Masquer sur Mobile</p>
              <p className="text-[10px] text-slate-400">Ne pas afficher sur smartphones</p>
            </div>
            <button
              type="button"
              onClick={() => onChange('hideOnMobile', !s.hideOnMobile)}
              className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                s.hideOnMobile ? 'bg-red-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                  s.hideOnMobile ? 'translate-x-4.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-800">Masquer sur Ordinateur</p>
              <p className="text-[10px] text-slate-400">Ne pas afficher sur grands écrans</p>
            </div>
            <button
              type="button"
              onClick={() => onChange('hideOnDesktop', !s.hideOnDesktop)}
              className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                s.hideOnDesktop ? 'bg-red-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                  s.hideOnDesktop ? 'translate-x-4.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </AccordionSection>
    </div>
  )
}

// ─── Advanced Tab ────────────────────────────────────────────────────
function AdvancedTab({ section, s, onChange }: { section: PageSection; s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  return (
    <div className="space-y-3 py-1">
      <AccordionSection title="Ancre &amp; Identifiants" defaultOpen>
        <FieldGroup label="Ancre HTML (Lien direct vers cette section)" helpText="Permet de cibler la section via un lien de menu, ex: #collection ou #atelier">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-xs font-mono font-bold">#</span>
            <TextInput value={s.anchorId || ''} onChange={(v) => onChange('anchorId', v)} placeholder="ma-section" />
          </div>
        </FieldGroup>
        <FieldGroup label="Classes CSS Personnalisées">
          <TextInput value={s.customClass || ''} onChange={(v) => onChange('customClass', v)} placeholder="ex: opacity-95 my-custom-class" />
        </FieldGroup>
        <FieldGroup label="ID Système (Interne)">
          <div className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-500 font-mono">
            {section.id}
          </div>
        </FieldGroup>
      </AccordionSection>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════

export function SectionInspectorPanel({
  section,
  onBack,
  onUpdateSettings,
  onDeleteSection,
}: SectionInspectorPanelProps) {
  const [activeTab, setActiveTab] = useState('content')
  const s = section.settings || {}

  const handleChange = (key: string, value: any) => {
    onUpdateSettings(section.id, { [key]: value })
  }

  const contentFieldsMap: Record<string, React.ReactNode> = {
    hero: <HeroContentFields s={s} onChange={handleChange} />,
    collection: <CollectionContentFields s={s} onChange={handleChange} />,
    craft: <CraftContentFields s={s} onChange={handleChange} />,
    custom_atelier: <AtelierContentFields s={s} onChange={handleChange} />,
    interiors: <InteriorsContentFields s={s} onChange={handleChange} />,
    reassurance: <ReassuranceContentFields s={s} onChange={handleChange} />,
    demo: <DemoContentFields s={s} onChange={handleChange} />,
    about: <AboutContentFields s={s} onChange={handleChange} />,
    faq: <FAQContentFields s={s} onChange={handleChange} />,
  }

  const tabContentMap: Record<string, React.ReactNode> = {
    content: contentFieldsMap[section.type] || <GenericContentFields s={s} onChange={handleChange} />,
    design: <DesignTab s={s} onChange={handleChange} />,
    layout: <LayoutTab s={s} onChange={handleChange} />,
    animation: <AnimationTab s={s} onChange={handleChange} />,
    responsive: <ResponsiveTab s={s} onChange={handleChange} />,
    advanced: <AdvancedTab section={section} s={s} onChange={handleChange} />,
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 space-y-2.5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 transition font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour aux sections
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{section.name}</h3>
            <span className="text-[9px] font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded-full uppercase font-bold">
              {section.type}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Supprimer la section "${section.name}" ?`)) {
                onDeleteSection(section.id)
                onBack()
              }
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
            title="Supprimer la section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-100 px-3 flex gap-0.5 overflow-x-auto scrollbar-hide bg-slate-50/50">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'border-red-600 text-red-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {tabContentMap[activeTab]}
      </div>
    </div>
  )
}
