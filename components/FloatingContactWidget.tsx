'use client'

import { useState } from 'react'
import {
  MessageCircle,
  X,
  Send,
  HelpCircle,
  Mail,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronDown,
} from 'lucide-react'

const FAQ_ITEMS = [
  {
    q: 'Comment s&apos;alimente le rétroéclairage LED ?',
    a: 'Chaque cadre intègre un câble USB discret à l&apos;arrière. Vous pouvez le brancher sur n&apos;importe quelle prise secteur, un port USB d&apos;ordinateur ou une simple batterie externe portable cachée derrière le cadre.',
  },
  {
    q: 'Quels sont les délais et modes d&apos;expédition ?',
    a: 'Chaque pièce est emballée dans notre atelier en France sous carton renforcé crash-proof. Expédition en 24h à 48h par Colissimo Suivi avec remise sans signature et numéro de tracking SMS.',
  },
  {
    q: 'Puis-je commander une voiture personnalisée ?',
    a: 'Absolument ! Notre atelier sur-mesure vous permet de configurer le modèle de votre choix, l&apos;échelle et la gravure d&apos;immatriculation.',
  },
]

export function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null)
  const [formSent, setFormSent] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSent(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' })
      setFormSent(false)
      setIsOpen(false)
    }, 2500)
  }

  return (
    <>
      {/* ─── BOUTON FLOTTANT EN BAS À DROITE ─── */}
      <div className="fixed bottom-6 right-6 z-[9990] flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-neutral-900/90 hover:bg-neutral-800 text-white border border-amber-400/40 hover:border-amber-400 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Contacter l'atelier"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>

          <MessageCircle className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
            Une question ? Atelier en direct
          </span>
          <span className="text-xs font-bold uppercase tracking-wider sm:hidden">
            Contact
          </span>
        </button>
      </div>

      {/* ─── MODAL / VOLET DE CONTACT INTERACTIF ─── */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0c0c0a] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            
            {/* Header Modal */}
            <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                    Atelier Disponible · Réponse &lt; 2h
                  </span>
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Conseil & Support Client Dream Frame
                </h3>
                <p className="text-xs text-neutral-400 font-light">
                  Une question sur un modèle, les LED ou votre commande ? Nous sommes là pour vous.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Actions Rapides : WhatsApp Direct & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="https://wa.me/33600000000?text=Bonjour%20l'atelier%20Dream%20Frame,%20j'ai%20une%20question%20concernant%20les%20cadres%203D"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 transition flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-bold flex-shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-emerald-300">
                    WhatsApp Atelier
                  </p>
                  <p className="text-[10px] text-emerald-400 font-mono">Discussion instantanée</p>
                </div>
              </a>

              <a
                href="mailto:contact@dreamframe.fr?subject=Question%20Cadre%20Dream%20Frame"
                className="p-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-amber-300">
                    Email Direct
                  </p>
                  <p className="text-[10px] text-neutral-400 font-mono">contact@dreamframe.fr</p>
                </div>
              </a>
            </div>

            {/* Formulaire de Message Express */}
            <div className="bg-neutral-950 border border-neutral-800/90 rounded-2xl p-4 sm:p-5 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Envoyer un message à l&apos;Atelier
              </h4>

              {formSent ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-1 animate-fade-in">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold text-white">Message bien transmis !</p>
                  <p className="text-[10px] text-neutral-400">
                    Notre équipe vous répondra par email dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-400"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Votre email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>

                  <textarea
                    required
                    rows={3}
                    placeholder="Votre question (modèle, personnalisation, suivi de commande...)"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-400 resize-none"
                  />

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Envoyer la demande</span>
                  </button>
                </form>
              )}
            </div>

            {/* Questions Fréquentes (FAQ Dépliante) */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-2">
                Questions les plus posées :
              </span>
              {FAQ_ITEMS.map((faq, idx) => {
                const isOpenFaq = openFaqIdx === idx
                return (
                  <div
                    key={faq.q}
                    className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpenFaq ? null : idx)}
                      className="w-full p-3 text-left flex items-center justify-between text-xs font-semibold text-white hover:text-amber-300 transition"
                    >
                      <span dangerouslySetInnerHTML={{ __html: faq.q }} />
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                          isOpenFaq ? 'rotate-180 text-amber-400' : ''
                        }`}
                      />
                    </button>
                    {isOpenFaq && (
                      <div
                        className="px-3 pb-3 text-xs text-neutral-400 font-light leading-relaxed border-t border-neutral-800/60 pt-2"
                        dangerouslySetInnerHTML={{ __html: faq.a }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
