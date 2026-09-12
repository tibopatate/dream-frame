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
  ChevronUp,
  Trash2,
  Plus,
  Check,
  Package,
} from 'lucide-react'
import { ProductImageUploader } from '@/components/admin/ProductImageUploader'
import { isVideoUrl } from '@/lib/utils'
import type { PageSection } from '@/lib/page-builder/types'

interface SectionInspectorPanelProps {
  section: PageSection
  products?: any[]
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
function HeroContentFields({
  s,
  onChange,
}: {
  s: Record<string, any>
  onChange: (k: string | Record<string, any>, v?: any) => void
}) {
  const currentMedia = s.bgVideo || s.bgImage || ''

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

      <AccordionSection title="Arrière-plan Vidéo ou Photographie" defaultOpen>
        <FieldGroup
          label="Média de fond principal du Hero Showroom"
          helpText="Téléversez une vidéo d'exception (MP4, WebM, MOV) ou une photographie HD de supercar. La vidéo se lancera automatiquement en arrière-plan."
        >
          <ProductImageUploader
            images={currentMedia ? [currentMedia] : []}
            onChange={(imgs) => {
              const url = imgs[0] || ''
              if (!url) {
                onChange({ bgImage: '', bgVideo: '' })
              } else if (isVideoUrl(url)) {
                onChange({ bgVideo: url, bgImage: url })
              } else {
                onChange({ bgImage: url, bgVideo: '' })
              }
            }}
            maxImages={1}
          />
        </FieldGroup>
      </AccordionSection>
    </>
  )
}

// ─── Collection Section Content (WITH PRODUCT PICKER) ────────────────
function CollectionContentFields({
  s,
  onChange,
  products = [],
}: {
  s: Record<string, any>
  onChange: (k: string, v: any) => void
  products?: any[]
}) {
  const mode = s.mode || 'auto' // 'auto' | 'manual'
  const selectedProductIds: string[] = Array.isArray(s.selectedProductIds) ? s.selectedProductIds : []

  const toggleProductSelection = (productId: string) => {
    let nextIds: string[]
    if (selectedProductIds.includes(productId)) {
      nextIds = selectedProductIds.filter((id) => id !== productId)
    } else {
      nextIds = [...selectedProductIds, productId]
    }
    onChange('selectedProductIds', nextIds)
    if (mode !== 'manual') {
      onChange('mode', 'manual')
    }
  }

  const moveProductInSelection = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= selectedProductIds.length) return
    const updated = [...selectedProductIds]
    const temp = updated[index]
    updated[index] = updated[target]
    updated[target] = temp
    onChange('selectedProductIds', updated)
  }

  return (
    <>
      <AccordionSection title="En-tête de la Collection" defaultOpen>
        <FieldGroup label="Titre de la section">
          <TextInput value={s.title || ''} onChange={(v) => onChange('title', v)} placeholder="NOTRE COLLECTION PASSIONNÉE" />
        </FieldGroup>
        <FieldGroup label="Sous-titre">
          <TextInput value={s.subtitle || ''} onChange={(v) => onChange('subtitle', v)} placeholder="Des légendes, une seule passion" />
        </FieldGroup>
      </AccordionSection>

      <AccordionSection title="Sélection des Cadres Automobiles" defaultOpen>
        <FieldGroup label="Mode de sélection des cadres">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChange('mode', 'auto')}
              className={`p-2.5 rounded-lg border text-xs font-semibold text-left transition cursor-pointer ${
                mode === 'auto'
                  ? 'border-red-500 bg-red-50 text-red-600 ring-1 ring-red-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="block font-bold">Automatique</span>
              <span className="text-[10px] text-slate-500 font-normal">Derniers ajouts</span>
            </button>
            <button
              type="button"
              onClick={() => onChange('mode', 'manual')}
              className={`p-2.5 rounded-lg border text-xs font-semibold text-left transition cursor-pointer ${
                mode === 'manual'
                  ? 'border-red-500 bg-red-50 text-red-600 ring-1 ring-red-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="block font-bold">Sélection Manuelle</span>
              <span className="text-[10px] text-slate-500 font-normal">Choisir au cas par cas</span>
            </button>
          </div>
        </FieldGroup>

        {mode === 'manual' ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                Cadres sélectionnés ({selectedProductIds.length})
              </span>
              {selectedProductIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => onChange('selectedProductIds', [])}
                  className="text-[10px] text-red-600 hover:underline cursor-pointer"
                >
                  Tout désélectionner
                </button>
              )}
            </div>

            {products.length === 0 ? (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                <Package className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                Aucun produit trouvé dans la boutique. Créez des produits dans l'onglet Produits.
              </div>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {products.map((prod) => {
                  const isSelected = selectedProductIds.includes(prod.id)
                  const selectedIndex = selectedProductIds.indexOf(prod.id)

                  return (
                    <div
                      key={prod.id}
                      onClick={() => toggleProductSelection(prod.id)}
                      className={`flex items-center gap-3 p-2 rounded-lg border transition cursor-pointer ${
                        isSelected
                          ? 'border-red-400 bg-red-50/40 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {/* Checkbox */}
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 transition ${
                          isSelected ? 'bg-red-600 border-red-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      {/* Photo Miniature */}
                      <div className="w-10 h-10 rounded-md bg-neutral-900 overflow-hidden flex-shrink-0 border border-slate-200 relative">
                        {prod.images?.[0] ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                            Sans photo
                          </div>
                        )}
                      </div>

                      {/* Infos Produit */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{prod.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {prod.brand} · {prod.price} €
                        </p>
                      </div>

                      {/* Ordre de tri dans la sélection */}
                      {isSelected && (
                        <div
                          className="flex flex-col gap-0.5 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            disabled={selectedIndex === 0}
                            onClick={() => moveProductInSelection(selectedIndex, 'up')}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                            title="Monter"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={selectedIndex === selectedProductIds.length - 1}
                            onClick={() => moveProductInSelection(selectedIndex, 'down')}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                            title="Descendre"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 pt-2">
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
            <FieldGroup label="Nombre maximum de cadres">
              <select
                value={s.limit || 5}
                onChange={(e) => onChange('limit', Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              >
                <option value={4}>4 Cadres</option>
                <option value={5}>5 Cadres (Recommandé)</option>
                <option value={8}>8 Cadres</option>
                <option value={12}>12 Cadres</option>
              </select>
            </FieldGroup>
          </div>
        )}
      </AccordionSection>
    </>
  )
}

// ─── Craft Section Content (Savoir-Faire 5 Couches) ──────────────────
function CraftContentFields({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  return (
    <>
      <AccordionSection title="En-tête Savoir-Faire" defaultOpen>
        <FieldGroup label="Badge supérieur">
          <TextInput value={s.badge || ''} onChange={(v) => onChange('badge', v)} placeholder="Exigence Artisanale" />
        </FieldGroup>
        <FieldGroup label="Titre principal">
          <TextInput value={s.title || ''} onChange={(v) => onChange('title', v)} placeholder="L'Anatomie d'une Pièce d'Exception" />
        </FieldGroup>
        <FieldGroup label="Sous-titre / Description">
          <TextInput value={s.desc || ''} onChange={(v) => onChange('desc', v)} placeholder="5 couches de matériaux nobles minutieusement assemblées dans notre atelier en France." multiline />
        </FieldGroup>
      </AccordionSection>

      <AccordionSection title="Les 5 Couches Artisanales" defaultOpen>
        {[
          { num: 1, defaultTitle: "Papier d'Art 310g", defaultDesc: 'Canson Rag Photographique pur coton, résistant plus de 100 ans.' },
          { num: 2, defaultTitle: 'Découpe Laser Micron', defaultDesc: 'Ailerons, jantes et galbes découpés sans aucune bavure.' },
          { num: 3, defaultTitle: 'Passe-Partout Biseauté', defaultDesc: 'Biseau 45° taillé à la main dans un carton de conservation sans acide.' },
          { num: 4, defaultTitle: 'Module LED 3000K', defaultDesc: 'Éclairage blanc chaud basse consommation pour sublimer la silhouette.' },
          { num: 5, defaultTitle: 'Vitrage Acrylique HD', defaultDesc: 'Transmittance optique 99,2% et cadre aluminium anodisé noir.' },
        ].map((layer) => (
          <div key={layer.num} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <p className="text-[11px] font-bold text-slate-800">Couche {layer.num}</p>
            <FieldGroup label="Titre">
              <TextInput
                value={s[`layer${layer.num}Title`] || ''}
                onChange={(v) => onChange(`layer${layer.num}Title`, v)}
                placeholder={layer.defaultTitle}
              />
            </FieldGroup>
            <FieldGroup label="Description">
              <TextInput
                value={s[`layer${layer.num}Desc`] || ''}
                onChange={(v) => onChange(`layer${layer.num}Desc`, v)}
                placeholder={layer.defaultDesc}
                multiline
              />
            </FieldGroup>
          </div>
        ))}
      </AccordionSection>
    </>
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
      <FieldGroup label="Sous-titre / Description">
        <TextInput value={s.desc || ''} onChange={(v) => onChange('desc', v)} placeholder="Découvrez comment nos cadres d’exception s’intègrent parfaitement dans tout type d’intérieur." multiline />
      </FieldGroup>
    </AccordionSection>
  )
}

// ─── Reassurance Content ─────────────────────────────────────────────
function ReassuranceContentFields({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  return (
    <AccordionSection title="Engagements &amp; Garanties" defaultOpen>
      {[
        { i: 1, defaultT: 'Fabrication Française', defaultD: 'Assemblé à la main avec passion dans notre atelier.' },
        { i: 2, defaultT: 'Livraison Blindée', defaultD: 'Emballage renforcé sur-mesure résistant aux chocs.' },
        { i: 3, defaultT: 'LED Garantie 5 Ans', defaultD: 'Composants haute longévité avec batterie discrète.' },
        { i: 4, defaultT: 'Satisfait ou Remboursé', defaultD: '14 jours pour admirer et tester votre cadre chez vous.' },
      ].map((item) => (
        <div key={item.i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
          <FieldGroup label={`Engagement ${item.i} — Titre`}>
            <TextInput value={s[`item${item.i}Title`] || ''} onChange={(v) => onChange(`item${item.i}Title`, v)} placeholder={item.defaultT} />
          </FieldGroup>
          <FieldGroup label={`Engagement ${item.i} — Description`}>
            <TextInput value={s[`item${item.i}Desc`] || ''} onChange={(v) => onChange(`item${item.i}Desc`, v)} placeholder={item.defaultD} />
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
      <FieldGroup label="Description de la Maison Dream Frame">
        <TextInput
          value={s.desc || ''}
          onChange={(v) => onChange('desc', v)}
          placeholder="Dream Frame est né d'une passion commune pour l'automobile et l'artisanat français..."
          multiline
        />
      </FieldGroup>
    </AccordionSection>
  )
}

// ─── FAQ Content (100% DYNAMIC: ADD, REMOVE, REORDER) ────────────────
interface FaqItem {
  id: string
  q: string
  a: string
}

function FAQContentFields({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  // Convert legacy q1, a1, q2, a2 or initialize array
  const getInitialItems = (): FaqItem[] => {
    if (Array.isArray(s.items) && s.items.length > 0) {
      return s.items
    }
    const legacy: FaqItem[] = []
    for (let i = 1; i <= 10; i++) {
      if (s[`q${i}`] || s[`a${i}`]) {
        legacy.push({
          id: `faq-${i}`,
          q: s[`q${i}`] || '',
          a: s[`a${i}`] || '',
        })
      }
    }
    if (legacy.length > 0) return legacy
    return [
      {
        id: 'faq-1',
        q: 'Quels sont les délais de fabrication et de livraison ?',
        a: 'Chaque cadre étant assemblé à la main à la demande dans notre atelier en France, il faut compter 4 à 6 jours ouvrés pour la confection et l\'expédition sécurisée en Colissimo Suivi.',
      },
      {
        id: 'faq-2',
        q: 'Comment s\'alimente le rétroéclairage LED ?',
        a: 'Nos cadres intègrent un ruban LED discret blanc chaud 3000K, doté d\'une batterie rechargeable discrète en USB-C (câble fourni), garantissant une pose murale propre sans aucun fil apparent.',
      },
      {
        id: 'faq-3',
        q: 'Puis-je commander un modèle spécifique sur-mesure ?',
        a: 'Absolument ! Notre atelier sur-mesure et notre configurateur 3D vous permettent de configurer le cadre avec le véhicule de vos rêves, votre format et vos options.',
      },
    ]
  }

  const items: FaqItem[] = getInitialItems()

  const updateItem = (index: number, field: 'q' | 'a', value: string) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    onChange('items', updated)
  }

  const addItem = () => {
    const newItem: FaqItem = {
      id: `faq-${Date.now()}`,
      q: 'Nouvelle question ?',
      a: 'Réponse détaillée...',
    }
    onChange('items', [...items, newItem])
  }

  const deleteItem = (index: number) => {
    if (items.length <= 1) {
      alert('La FAQ doit comporter au moins une question.')
      return
    }
    const updated = items.filter((_, idx) => idx !== index)
    onChange('items', updated)
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= items.length) return
    const updated = [...items]
    const temp = updated[index]
    updated[index] = updated[target]
    updated[target] = temp
    onChange('items', updated)
  }

  return (
    <>
      <AccordionSection title="En-tête de la FAQ" defaultOpen>
        <FieldGroup label="Titre de la section">
          <TextInput value={s.title || ''} onChange={(v) => onChange('title', v)} placeholder="Questions Fréquentes" />
        </FieldGroup>
      </AccordionSection>

      <AccordionSection title={`Questions & Réponses (${items.length})`} defaultOpen>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative group"
            >
              {/* Header de la question avec contrôles */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Question #{idx + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, 'up')}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-20 cursor-pointer"
                    title="Monter"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === items.length - 1}
                    onClick={() => moveItem(idx, 'down')}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-20 cursor-pointer"
                    title="Descendre"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteItem(idx)}
                    className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Supprimer la question"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Champ Question */}
              <FieldGroup label="Question">
                <TextInput
                  value={item.q}
                  onChange={(v) => updateItem(idx, 'q', v)}
                  placeholder="Intitulé de la question..."
                />
              </FieldGroup>

              {/* Champ Réponse */}
              <FieldGroup label="Réponse">
                <TextInput
                  value={item.a}
                  onChange={(v) => updateItem(idx, 'a', v)}
                  placeholder="Réponse détaillée..."
                  multiline
                />
              </FieldGroup>
            </div>
          ))}

          {/* Bouton Ajouter une question */}
          <button
            type="button"
            onClick={addItem}
            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-red-300 bg-red-50/50 hover:bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une nouvelle question</span>
          </button>
        </div>
      </AccordionSection>
    </>
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
    { label: 'Gris Carbone (#121210)', value: '#121210' },
    { label: 'Gris Ardoise (#1a1a18)', value: '#1a1a18' },
  ]

  return (
    <div className="space-y-3 py-1">
      <AccordionSection title="Couleur d'Arrière-Plan" defaultOpen>
        <FieldGroup label="Fond de la section">
          <div className="space-y-1.5">
            {bgOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange('bgColor', opt.value)}
                className={`w-full p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between transition cursor-pointer ${
                  (s.bgColor || '#080807') === opt.value
                    ? 'border-red-500 bg-red-50/20 text-slate-900 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-slate-300 shadow-xs" style={{ backgroundColor: opt.value }} />
                  <span>{opt.label}</span>
                </div>
                {(s.bgColor || '#080807') === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-red-600" />}
              </button>
            ))}
          </div>
        </FieldGroup>
      </AccordionSection>

      <AccordionSection title="Bordure Supérieure & Séparateur">
        <FieldGroup label="Ligne de séparation">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-700">Bordure discrète</span>
            <button
              type="button"
              onClick={() => onChange('topBorder', s.topBorder === false ? true : false)}
              className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                s.topBorder !== false ? 'bg-red-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                  s.topBorder !== false ? 'translate-x-4.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
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
      <AccordionSection title="Effets d'Apparition" defaultOpen>
        <div className="space-y-1.5">
          {anims.map((a) => (
            <button
              key={a.value}
              type="button"
              onClick={() => onChange('animation', a.value)}
              className={`w-full p-2.5 text-left rounded-lg border text-xs transition cursor-pointer flex items-center justify-between ${
                (s.animation || 'fade') === a.value
                  ? 'border-red-500 bg-red-50 text-red-600 font-semibold'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{a.label}</span>
              {(s.animation || 'fade') === a.value && <span className="w-1.5 h-1.5 rounded-full bg-red-600" />}
            </button>
          ))}
        </div>
      </AccordionSection>
    </div>
  )
}

// ─── Responsive Tab ──────────────────────────────────────────────────
function ResponsiveTab({ s, onChange }: { s: Record<string, any>; onChange: (k: string, v: any) => void }) {
  return (
    <div className="space-y-3 py-1">
      <AccordionSection title="Visibilité par Appareil" defaultOpen>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
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

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
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
  products = [],
  onBack,
  onUpdateSettings,
  onDeleteSection,
}: SectionInspectorPanelProps) {
  const [activeTab, setActiveTab] = useState('content')
  const s = section.settings || {}

  const handleChange = (keyOrUpdates: string | Record<string, any>, value?: any) => {
    if (typeof keyOrUpdates === 'string') {
      onUpdateSettings(section.id, { [keyOrUpdates]: value })
    } else {
      onUpdateSettings(section.id, keyOrUpdates)
    }
  }

  const contentFieldsMap: Record<string, React.ReactNode> = {
    hero: <HeroContentFields s={s} onChange={handleChange} />,
    collection: <CollectionContentFields s={s} onChange={handleChange} products={products} />,
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
