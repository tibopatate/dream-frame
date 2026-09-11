'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle, ShieldCheck, Zap, Truck, PackageCheck, RotateCcw } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  icon: any
}

const FAQS: FAQItem[] = [
  {
    question: "Comment s'alimente l'éclairage LED intégré ?",
    answer: "Chaque cadre intègre un ruban LED 3000K (lumière chaude galerie) à basse tension. Il est relié à un câble USB discret fourni. Vous pouvez le brancher directement sur une prise murale USB, un adaptateur de téléphone standard ou même une petite batterie externe dissimulée à l'arrière pour un rendu 100% sans fil apparent.",
    icon: Zap,
  },
  {
    question: "Comment l'accrocher au mur ou l'exposer ?",
    answer: "Le châssis dispose d'une attache murale crantée robuste pré-montée au dos pour une fixation solide et invisible sur n'importe quel mur. Grâce à son épaisseur de profilé, le cadre peut également être posé directement debout sur un bureau, une étagère ou une commode sans risque de basculement.",
    icon: PackageCheck,
  },
  {
    question: "Quels sont les délais d'expédition et de livraison ?",
    answer: "Toutes les pièces de la collection sont contrôlées et préparées avec le plus grand soin sous 24 à 48 heures ouvrées dans notre atelier en France. L'acheminement s'effectue ensuite par Colissimo Suivi La Poste (48h ouvrées) avec un numéro de suivi envoyé automatiquement par e-mail.",
    icon: Truck,
  },
  {
    question: "Le vitrage et la miniature sont-ils protégés pendant le transport ?",
    answer: "Oui, à 100%. Nous utilisons des mousses d'amortissement antichoc haute densité taillées sur-mesure au format du cadre, avec film électrostatique de protection sur le vitrage et carton renforcé triple cannelure. En cas de dommage lors de l'acheminement, un remplacement à neuf est immédiatement pris en charge par notre atelier.",
    icon: ShieldCheck,
  },
  {
    question: "Puis-je retourner le cadre si je change d'avis ?",
    answer: "Tout à fait. Vous disposez de la garantie légale de rétractation de 14 jours calendaires à compter de la livraison pour demander un retour sans motif et bénéficier d'un remboursement intégral sur votre moyen de paiement d'origine.",
    icon: RotateCcw,
  },
]

export function ProductFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section className="mt-16 sm:mt-24 border-t border-neutral-800/80 pt-12 sm:pt-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-mono uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Questions Fréquentes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Tout ce que vous devez savoir
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-lg mx-auto">
            Retrouvez les réponses aux questions les plus courantes sur la fabrication, l&apos;alimentation et la livraison de nos cadres d&apos;art.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx
            const Icon = faq.icon
            return (
              <div
                key={idx}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-neutral-700 bg-neutral-900/60 shadow-lg'
                    : 'border-neutral-800/80 bg-neutral-950/40 hover:border-neutral-700/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="flex items-center gap-3 text-sm sm:text-base font-semibold text-white">
                    <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 text-xs sm:text-sm text-neutral-300 leading-relaxed font-light border-t border-neutral-800/50 mt-1">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}