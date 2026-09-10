'use client'

import { HelpCircle, Command, Sparkles, BookOpen, Layers } from 'lucide-react'

export function HelpPanel() {
  const shortcuts = [
    { key: 'Ctrl + Z', desc: 'Annuler la dernière modification' },
    { key: 'Ctrl + Y', desc: 'Rétablir la modification' },
    { key: 'Clic section', desc: 'Ouvrir l\'inspecteur de personnalisation' },
    { key: 'Glisser-déposer', desc: 'Réorganiser l\'ordre des sections' },
  ]

  const tips = [
    {
      title: 'Photographie du Hero',
      desc: 'Privilégiez une image haute définition au ratio 16:9 ou 21:9 avec un cadrage centré de la supercar pour un rendu cinéma maximal.',
    },
    {
      title: 'Ordre des sections recommandé',
      desc: 'Hero Showroom → Notre Collection → Anatomie Savoir-Faire → Atelier Sur-Mesure → Mises en situation → FAQ → Avis.',
    },
    {
      title: 'Publication immédiate',
      desc: 'Lorsque vous cliquez sur "Enregistrer & Publier", le site public se met à jour instantanément et un point d\'historique est sauvegardé.',
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-red-600" />
          Aide &amp; Prise en Main
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Guide rapide pour personnaliser votre site Dream Frame en toute autonomie.
        </p>
      </div>

      {/* Raccourcis clavier */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Command className="w-3.5 h-3.5" /> Raccourcis pratiques
        </h3>
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-xs">
          {shortcuts.map((sc) => (
            <div key={sc.key} className="p-3 flex items-center justify-between text-xs">
              <span className="text-slate-600">{sc.desc}</span>
              <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[11px] font-mono text-slate-800 font-bold">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>

      {/* Conseils atelier */}
      <div className="space-y-3 pt-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Conseils de présentation
        </h3>
        <div className="space-y-2.5">
          {tips.map((tip) => (
            <div key={tip.title} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <p className="text-xs font-bold text-slate-900">{tip.title}</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
