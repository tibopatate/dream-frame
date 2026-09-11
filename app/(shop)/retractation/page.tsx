import type { Metadata } from 'next'
import { RotateCcw, FileText, Mail, PackageCheck, Send, CreditCard } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Droit de Rétractation & Retours — Dream Frame Officiel',
  description: 'Modalités du droit de rétractation de 14 jours et formulaire officiel de retour pour vos cadres Dream Frame.',
}

export default function RetractationPage() {
  return (
    <main className="min-h-screen bg-[#080807] text-white selection:bg-amber-400 selection:text-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* En-tête */}
        <div className="space-y-4 border-b border-neutral-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-mono uppercase tracking-wider">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Garantie Sérénité 14 Jours</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Droit de Rétractation
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Vous disposez d&apos;un délai légal de 14 jours calendaires à compter de la réception de votre colis pour changer d&apos;avis en toute tranquillité.
          </p>
        </div>

        {/* Modalités légales */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            Conditions &amp; Modalités de Retour
          </h2>
          <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <p>
              Conformément à l&apos;article L. 221-18 du Code de la consommation, vous pouvez exercer votre droit de rétractation sans avoir à motiver votre décision ni à payer de pénalités.
            </p>
            <p>
              Les cadres d&apos;art doivent être retournés dans leur état d&apos;origine, complets (avec leur miniature, leur alimentation et leur système LED intact), emballés avec soin dans leurs protections d&apos;origine afin de garantir un transport sans dommage.
            </p>
          </div>
        </section>

        {/* Formulaire type à copier */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            Modèle de Formulaire de Rétractation
          </h2>
          <p className="text-sm text-neutral-300">
            Copiez le texte ci-dessous et adressez-le par e-mail à notre atelier à <a href="mailto:contact@dreamframe.fr" className="text-amber-400 font-semibold hover:underline">contact@dreamframe.fr</a> :
          </p>

          <div className="bg-neutral-950 p-5 sm:p-6 rounded-xl border border-neutral-800 font-mono text-neutral-300 text-xs sm:text-sm leading-relaxed select-all">
            <p className="text-amber-400 font-bold mb-3">// Formulaire de rétractation officiel Dream Frame</p>
            <p className="text-neutral-400">À l&apos;attention de : Dream Frame Atelier SASU — contact@dreamframe.fr</p>
            <p className="mt-3">Je vous notifie par la présente ma rétractation du contrat portant sur la vente du produit ci-dessous :</p>
            <p className="mt-3 text-neutral-200">▪ Produit commandé : _______________________________________________</p>
            <p className="text-neutral-200">▪ Numéro de commande : DF-_____________________________________</p>
            <p className="text-neutral-200">▪ Commandé le : [__/__/____]  /  Reçu le : [__/__/____]</p>
            <p className="mt-3 text-neutral-200">▪ Nom &amp; Prénom du client : _________________________________________</p>
            <p className="text-neutral-200">▪ Adresse postale de livraison : ____________________________________</p>
            <p className="mt-3 text-neutral-400">Date et Signature (en cas d&apos;envoi papier) :</p>
            <p className="mt-2 text-neutral-400">Fait à ______________________, le [__/__/____]</p>
          </div>
        </section>

        {/* Procédure étape par étape */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            Procédure de Retour en 4 Étapes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-neutral-950/60 p-5 rounded-xl border border-neutral-800/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <p className="font-semibold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                Notification
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Envoyez le formulaire de rétractation par e-mail à contact@dreamframe.fr avant l&apos;expiration des 14 jours.
              </p>
            </div>

            <div className="bg-neutral-950/60 p-5 rounded-xl border border-neutral-800/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <p className="font-semibold text-white flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-amber-400" />
                Conditionnement
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Replacez le cadre avec ses cales en mousse et accessoires dans son carton d&apos;emballage protecteur.
              </p>
            </div>

            <div className="bg-neutral-950/60 p-5 rounded-xl border border-neutral-800/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <p className="font-semibold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-400" />
                Expédition
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Déposez le colis en bureau de poste avec affranchissement Colissimo Suivi à destination de notre atelier.
              </p>
            </div>

            <div className="bg-neutral-950/60 p-5 rounded-xl border border-neutral-800/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <p className="font-semibold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                Remboursement Intégral
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Dès contrôle qualité en atelier, le remboursement est crédité sous 5 jours ouvrés sur votre moyen de paiement d&apos;origine.
              </p>
            </div>
          </div>
        </section>

        {/* Bas de page */}
        <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-400">
          <p>Dernière mise à jour : 11 septembre 2026</p>
          <p className="font-mono text-neutral-400">Dream Frame Atelier SASU — Service Après-Vente &amp; Retours</p>
        </div>
      </div>
    </main>
  )
}

