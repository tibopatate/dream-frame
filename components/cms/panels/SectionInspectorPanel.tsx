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
  ImageIcon,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
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

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">{label}</label>
      {children}
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
  const cls = 'w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition'
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
        className="w-full flex items-center justify-between py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 transition cursor-pointer"
      >
        <span>{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="pb-4 space-y-4">{children}</div>}
    </div>
  )
}

// ─── Hero Section Content ────────────────────────────────────────────
function HeroContentFields({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  return (
    <>
      <AccordionSection title="Texte principal" defaultOpen>
        <FieldGroup label="Badge / Accroche">
          <TextInput value={s.badgeText || ''} onChange={(v) => onChange('badgeText', v)} placeholder="L'ART DE CAPTURER" />
        </FieldGroup>
        <FieldGroup label="Titre principal">
          <TextInput value={s.title || ''} onChange={(v) => onChange('title', v)} placeholder="L'EXCEPTIONNEL" />
        </FieldGroup>
        <FieldGroup label="Sous-titre">
          <TextInput value={s.subtitle || ''} onChange={(v) => onChange('subtitle', v)} placeholder="Des voitures de légende..." multiline />
        </FieldGroup>
      </AccordionSection>

      <AccordionSection title="Boutons d'action">
        <FieldGroup label="Bouton principal — Texte">
          <TextInput value={s.primaryBtnText || ''} onChange={(v) => onChange('primaryBtnText', v)} placeholder="VISITER NOTRE GALERIE" />
        </FieldGroup>
        <FieldGroup label="Bouton principal — Lien">
          <TextInput value={s.primaryBtnLink || ''} onChange={(v) => onChange('primaryBtnLink', v)} placeholder="/catalogue" />
        </FieldGroup>
        <FieldGroup label="Bouton secondaire — Texte">
          <TextInput value={s.secondaryBtnText || ''} onChange={(v) => onChange('secondaryBtnText', v)} placeholder="Découvrir" />
        </FieldGroup>
        <FieldGroup label="Bouton secondaire — Lien">
          <TextInput value={s.secondaryBtnLink || ''} onChange={(v) => onChange('secondaryBtnLink', v)} placeholder="/configurateur" />
        </FieldGroup>
      </AccordionSection>

      <AccordionSection title="Image de fond">
        <ProductImageUploader
          images={s.bgImage ? [s.bgImage] : []}
          onChange={(imgs) => onChange('bgImage', imgs[0] || '/images/hero-f40-real.jpg')}
          maxImages={1}
        />
      </AccordionSection>
    </>
  )
}

// ─── Collection Section Content ──────────────────────────────────────
function CollectionContentFields({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  return (
    <>
      <AccordionSection title="Paramètres de la collection" defaultOpen>
        <FieldGroup label="Titre de la section">
          <TextInput value={s.title || ''} onChange={(v) => onChange('title', v)} placeholder="Notre Collection" />
        </FieldGroup>
        <FieldGroup label="Catégorie">
          <select
            value={s.category || 'ALL'}
            onChange={(e) => onChange('category', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          >
            <option value="ALL">Toutes les époques</option>
            <option value="VINTAGE">Vintage (avant 2000)</option>
            <option value="MODERN">Moderne (2000+)</option>
          </select>
        </FieldGroup>
        <FieldGroup label="Nombre de cadres affichés">
          <select
            value={s.limit || 4}
            onChange={(e) => onChange('limit', Number(e.target.value))}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          >
            <option value={4}>4 Cadres</option>
            <option value={8}>8 Cadres</option>
            <option value={12}>12 Cadres</option>
          </select>
        </FieldGroup>
      </AccordionSection>
    </>
  )
}

// ─── Craft Section Content ───────────────────────────────────────────
function CraftContentFields({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  return (
    <AccordionSection title="Savoir-faire" defaultOpen>
      <FieldGroup label="Titre de la section">
        <TextInput value={s.title || ''} onChange={(v) => onChange('title', v)} placeholder="L'Anatomie d'une Pièce d'Exception" />
      </FieldGroup>
      <FieldGroup label="Sous-titre">
        <TextInput value={s.subtitle || ''} onChange={(v) => onChange('subtitle', v)} placeholder="5 couches de perfection..." multiline />
      </FieldGroup>
    </AccordionSection>
  )
}

// ─── Custom Atelier Content ──────────────────────────────────────────
function AtelierContentFields({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  return (
    <AccordionSection title="Atelier Sur-Mesure" defaultOpen>
      <FieldGroup label="Titre">
        <TextInput value={s.title || ''} onChange={(v) => onChange('title', v)} placeholder="Un modèle précis ?" />
      </FieldGroup>
      <FieldGroup label="Description">
        <TextInput value={s.desc || ''} onChange={(v) => onChange('desc', v)} placeholder="Composez votre cadre idéal..." multiline />
      </FieldGroup>
      <FieldGroup label="Texte du bouton">
        <TextInput value={s.btnText || ''} onChange={(v) => onChange('btnText', v)} placeholder="Accéder à l'Atelier" />
      </FieldGroup>
      <FieldGroup label="Lien du bouton">
        <TextInput value={s.btnLink || ''} onChange={(v) => onChange('btnLink', v)} placeholder="/configurateur" />
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
        <div key={i} className="space-y-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
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
    <AccordionSection title="Contenu" defaultOpen>
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
function DesignTab() {
  return (
    <div className="space-y-3 py-2">
      <p className="text-xs text-slate-400 italic">
        Les options de design global sont disponibles dans la catégorie &quot;Design &amp; Apparence&quot; de la barre latérale.
      </p>
      <AccordionSection title="Couleurs de la section" defaultOpen={false}>
        <p className="text-xs text-slate-400">Personnalisation individuelle des couleurs — bientôt disponible.</p>
      </AccordionSection>
      <AccordionSection title="Typographie" defaultOpen={false}>
        <p className="text-xs text-slate-400">Personnalisation de la typographie par section — bientôt disponible.</p>
      </AccordionSection>
    </div>
  )
}

// ─── Layout Tab ──────────────────────────────────────────────────────
function LayoutTab() {
  return (
    <div className="space-y-3 py-2">
      <AccordionSection title="Dimensions" defaultOpen={false}>
        <p className="text-xs text-slate-400">Largeur, hauteur, padding — bientôt disponible.</p>
      </AccordionSection>
      <AccordionSection title="Espacement" defaultOpen={false}>
        <p className="text-xs text-slate-400">Marges internes et externes — bientôt disponible.</p>
      </AccordionSection>
    </div>
  )
}

// ─── Animation Tab ───────────────────────────────────────────────────
function AnimationTab() {
  return (
    <div className="space-y-3 py-2">
      <AccordionSection title="Entrée" defaultOpen={false}>
        <p className="text-xs text-slate-400">Animation d&apos;apparition au scroll — bientôt disponible.</p>
      </AccordionSection>
      <AccordionSection title="Hover" defaultOpen={false}>
        <p className="text-xs text-slate-400">Effets au survol — bientôt disponible.</p>
      </AccordionSection>
    </div>
  )
}

// ─── Responsive Tab ──────────────────────────────────────────────────
function ResponsiveTab() {
  return (
    <div className="space-y-3 py-2">
      <AccordionSection title="Desktop" defaultOpen={false}>
        <p className="text-xs text-slate-400">Paramètres spécifiques bureau — bientôt disponible.</p>
      </AccordionSection>
      <AccordionSection title="Mobile" defaultOpen={false}>
        <p className="text-xs text-slate-400">Paramètres spécifiques mobile — bientôt disponible.</p>
      </AccordionSection>
    </div>
  )
}

// ─── Advanced Tab ────────────────────────────────────────────────────
function AdvancedTab({ section }: { section: PageSection }) {
  return (
    <div className="space-y-3 py-2">
      <AccordionSection title="Identifiants" defaultOpen>
        <FieldGroup label="ID de section">
          <div className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-500 font-mono">
            {section.id}
          </div>
        </FieldGroup>
        <FieldGroup label="Type">
          <div className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-500 font-mono">
            {section.type}
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
    about: <AboutContentFields s={s} onChange={handleChange} />,
    faq: <FAQContentFields s={s} onChange={handleChange} />,
  }

  const tabContentMap: Record<string, React.ReactNode> = {
    content: contentFieldsMap[section.type] || <GenericContentFields s={s} onChange={handleChange} />,
    design: <DesignTab />,
    layout: <LayoutTab />,
    animation: <AnimationTab />,
    responsive: <ResponsiveTab />,
    advanced: <AdvancedTab section={section} />,
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 space-y-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 transition font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Page d&apos;accueil
        </button>
        <div>
          <h3 className="text-base font-bold text-slate-900">{section.name}</h3>
          <span className="text-[10px] font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded-full uppercase font-bold">
            {section.type}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-100 px-4 flex gap-0 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2.5 text-xs font-medium border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'border-red-600 text-red-600'
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

      {/* Delete Section */}
      <div className="p-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => {
            if (confirm(`Supprimer la section "${section.name}" ?`)) {
              onDeleteSection(section.id)
              onBack()
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 font-medium text-sm rounded-lg transition cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          Supprimer cette section
        </button>
      </div>
    </div>
  )
}
