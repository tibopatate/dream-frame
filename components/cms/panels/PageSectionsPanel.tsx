'use client'

import { useState } from 'react'
import {
  GripVertical,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  FileText,
  Image as ImageIcon,
  Grid3X3,
  Layers,
  Sparkles,
  Settings2,
  MessageSquare,
  Mail,
  LayoutTemplate,
  HelpCircle,
  Palette,
  Home,
  ArrowDownUp,
} from 'lucide-react'
import type { PageSection, SectionType } from '@/lib/page-builder/types'

const SECTION_ICONS: Record<string, any> = {
  hero: ImageIcon,
  collection: Grid3X3,
  craft: Layers,
  demo: Sparkles,
  custom_atelier: Settings2,
  reassurance: Sparkles,
  interiors: Home,
  about: FileText,
  faq: HelpCircle,
  banner: LayoutTemplate,
  custom_text: FileText,
}

const SECTION_DESCRIPTIONS: Record<string, string> = {
  hero: 'Image, titre, description et bouton d\'action',
  collection: 'Affichage des collections principales',
  craft: 'Savoir-faire et processus de fabrication',
  demo: 'Module de démonstration interactif',
  custom_atelier: 'Invitation vers le configurateur',
  reassurance: 'Garanties et engagements',
  interiors: 'Photos de mise en situation',
  about: 'Présentation de la marque',
  faq: 'Questions fréquentes',
}

interface PageSectionsPanelProps {
  sections: PageSection[]
  activeSectionId: string | null
  hoveredSectionId: string | null
  onSelectSection: (id: string) => void
  onHoverSection: (id: string | null) => void
  onToggleSection: (id: string) => void
  onMoveSection: (index: number, direction: 'up' | 'down') => void
  onDeleteSection: (id: string) => void
  onAddSection: () => void
  onDragStart: (index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDrop: (index: number) => void
}

export function PageSectionsPanel({
  sections,
  activeSectionId,
  hoveredSectionId,
  onSelectSection,
  onHoverSection,
  onToggleSection,
  onMoveSection,
  onDeleteSection,
  onAddSection,
  onDragStart,
  onDragOver,
  onDrop,
}: PageSectionsPanelProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Page d&apos;accueil</h2>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
                {sections.length} sections
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Personnalisez la page principale de votre site. Ajoutez, modifiez et organisez vos sections pour créer une expérience unique.
            </p>
          </div>
        </div>
      </div>

      {/* Section List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {sections.map((section, idx) => {
          const Icon = SECTION_ICONS[section.type] || LayoutTemplate
          const isActive = activeSectionId === section.id
          const isHovered = hoveredSectionId === section.id

          return (
            <div
              key={section.id}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragOver={(e) => onDragOver(e, idx)}
              onDrop={() => onDrop(idx)}
              onMouseEnter={() => onHoverSection(section.id)}
              onMouseLeave={() => onHoverSection(null)}
              className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl border transition-all cursor-pointer select-none ${
                isActive
                  ? 'border-red-200 bg-red-50/50 shadow-sm'
                  : isHovered
                  ? 'border-slate-300 bg-slate-50'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              } ${section.hidden ? 'opacity-50' : ''}`}
              onClick={() => onSelectSection(section.id)}
            >
              {/* Drag Handle */}
              <div className="flex-shrink-0 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
                <GripVertical className="w-4 h-4" />
              </div>

              {/* Section Icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isActive ? 'bg-red-100' : 'bg-red-50'
              }`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-red-500'}`} />
              </div>

              {/* Section Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{section.name}</p>
                <p className="text-[11px] text-slate-400 truncate">
                  {SECTION_DESCRIPTIONS[section.type] || 'Section personnalisée'}
                </p>
              </div>

              {/* Actions Right matching reference mockup */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Visible Toggle Switch */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleSection(section.id)
                  }}
                  className={`relative w-8 h-4.5 rounded-full transition-colors cursor-pointer ${
                    !section.hidden ? 'bg-red-600' : 'bg-slate-300'
                  }`}
                  title={section.hidden ? 'Activer cette section' : 'Masquer cette section'}
                >
                  <div
                    className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-xs transition-transform ${
                      !section.hidden ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectSection(section.id)
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  title="Modifier"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteSection(section.id)
                  }}
                  className="p-1 rounded-md text-slate-300 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Open/Inspector arrow */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectSection(section.id)
                  }}
                  className="p-0.5 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  title="Ouvrir l'inspecteur"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <button
          type="button"
          onClick={onAddSection}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-lg transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Ajouter une section
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-700 text-xs font-medium transition cursor-pointer"
        >
          <ArrowDownUp className="w-3.5 h-3.5" />
          Réorganiser les sections
        </button>
      </div>
    </div>
  )
}
