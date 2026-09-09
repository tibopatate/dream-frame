'use client'

import React from 'react'
import { ElementType, PageElement } from '@/lib/page-builder/types'
import {
  Heading,
  Type,
  Square,
  ImageIcon,
  Tag,
  Minus,
  Box,
  LayoutTemplate,
  Package,
  X,
} from 'lucide-react'

interface InsertMenuProps {
  isOpen: boolean
  onClose: () => void
  onSelectType: (type: ElementType) => void
}

const ELEMENT_TEMPLATES: {
  type: ElementType
  title: string
  desc: string
  icon: any
}[] = [
  {
    type: 'heading',
    title: 'Titre (Heading)',
    desc: 'Grand titre percutant H1 / H2 pour attirer l’œil',
    icon: Heading,
  },
  {
    type: 'text',
    title: 'Paragraphe de Texte',
    desc: 'Bloc de texte élégant, descriptif et aéré',
    icon: Type,
  },
  {
    type: 'button',
    title: 'Bouton d’Action (CTA)',
    desc: 'Bouton d’achat ou redirection vers le configurateur',
    icon: Square,
  },
  {
    type: 'image',
    title: 'Image HD',
    desc: 'Photo de supercar ou mise en situation d’atelier',
    icon: ImageIcon,
  },
  {
    type: 'badge',
    title: 'Badge Atelier / Tag',
    desc: 'Petite pastille dorée ou noire pour rassurer',
    icon: Tag,
  },
  {
    type: 'product-list',
    title: 'Catalogue Dynamique',
    desc: 'Grille interactive connectée aux cadres du magasin',
    icon: Package,
  },
  {
    type: 'container',
    title: 'Conteneur Flexbox',
    desc: 'Boîte structurante pour aligner plusieurs éléments',
    icon: Box,
  },
  {
    type: 'section',
    title: 'Section Pleine Page',
    desc: 'Nouveau bloc horizontal complet avec son fond',
    icon: LayoutTemplate,
  },
  {
    type: 'divider',
    title: 'Ligne Séparatrice',
    desc: 'Trait fin pour espacer élégamment deux sections',
    icon: Minus,
  },
]

export function InsertMenu({ isOpen, onClose, onSelectType }: InsertMenuProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-6 text-white space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <h3 className="text-base font-bold">Ajouter un Élément</h3>
            <p className="text-xs text-neutral-400">
              Choisissez le composant à insérer sur votre page
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {ELEMENT_TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon
            return (
              <button
                key={tmpl.type}
                type="button"
                onClick={() => {
                  onSelectType(tmpl.type)
                  onClose()
                }}
                className="flex items-start gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-400/60 hover:bg-neutral-800/80 transition text-left cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400 group-hover:bg-amber-400 group-hover:text-black transition flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                    {tmpl.title}
                  </h4>
                  <p className="text-[10px] text-neutral-400 leading-tight">
                    {tmpl.desc}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
