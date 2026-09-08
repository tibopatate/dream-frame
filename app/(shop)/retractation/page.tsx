import type { Metadata } from 'next'
import { FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Droit de Rétractation — Dream Frame',
  description: 'Informations concernant le droit de rétractation de 14 jours et formulaire de retour de produit.',
}

export default function RetractationPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-10 text-neutral-600 text-xs sm:text-sm leading-relaxed bg-white">
      <h1 className="text-4xl font-serif italic text-black mb-8">Droit de Rétractation</h1>

      {/* Info box */}
      <div className="bg-neutral-50 border border-neutral-100 p-6 space-y-4">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-black" />
          Modalités de retour sous 14 jours
        </h2>
        <p>
          Conformément aux articles L. 221-18 et suivants du Code de la consommation, vous disposez d'un délai légal de <strong className="text-black">14 jours calendaires</strong> à compter de la réception de vos cadres pour exercer votre droit de rétractation, sans avoir à motiver votre décision.
        </p>
        <p>
          Les frais de retour Colissimo sont à votre charge exclusive. Le cadre doit être retourné complet (avec sa LED d'éclairage et son câble), dans son emballage d'origine et en parfait état de revente. Tout cadre endommagé ou incomplet ne pourra être remboursé.
        </p>
      </div>

      {/* Form template block */}
      <section className="space-y-4 pt-4">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">Modèle de formulaire de rétractation</h2>
        <p>
          Pour exercer votre droit, veuillez recopier et compléter le texte ci-dessous puis nous l'adresser par e-mail à <span className="text-black font-semibold">contact@dreamframe.fr</span>.
        </p>

        <div className="bg-neutral-50 border border-neutral-200 p-6 font-mono text-neutral-500 text-[10px] sm:text-xs leading-normal select-all relative">
          <p className="text-neutral-400 font-bold mb-4">// Formulaire de rétractation Dream Frame</p>
          <p>À l'attention de : Dream Frame (contact@dreamframe.fr)</p>
          <p>Je vous notifie par la présente ma rétractation du contrat portant sur la vente du produit ci-dessous :</p>
          <p className="mt-4">Nom du produit : _______________________________________________</p>
          <p>Numéro de commande : DF-_____________________________________</p>
          <p>Commandé le [__/__/____] / Reçu le [__/__/____]</p>
          <p className="mt-4">Nom du client : _______________________________________________</p>
          <p>Adresse de livraison : __________________________________________</p>
          <p>______________________________________________________________</p>
          <p className="mt-4">Date : [__/__/____]</p>
          <p>Signature (uniquement en cas de notification du présent formulaire sur papier) :</p>
          <p className="mt-8">______________________________________________________________</p>
        </div>
      </section>

      {/* Steps */}
      <section className="space-y-4 border-t border-neutral-100 pt-8">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">Procédure de retour</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong className="text-black">Notification :</strong> Envoyez le formulaire ci-dessus complété par e-mail à <span className="text-black">contact@dreamframe.fr</span>.
          </li>
          <li>
            <strong className="text-black">Préparation :</strong> Replacez le cadre avec soin dans son carton d'emballage d'origine de protection.
          </li>
          <li>
            <strong className="text-black">Expédition :</strong> Envoyez le colis en Colissimo Suivi de retour.
          </li>
          <li>
            <strong className="text-black">Remboursement :</strong> Dès réception et validation, nous procéderons au remboursement total de votre achat sous 5 jours ouvrés sur la carte bancaire d'origine.
          </li>
        </ol>
      </section>

      <p className="text-[10px] text-neutral-400 mt-12 pt-4 border-t border-neutral-150">
        Dernière mise à jour : 22 août 2026.
      </p>
    </main>
  )
}
