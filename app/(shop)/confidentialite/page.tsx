import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité — Dream Frame',
  description: 'Politique de confidentialité et traitement des données personnelles (RGPD) de la boutique Dream Frame.',
}

export default function ConfidentialitePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-10 text-neutral-600 text-xs sm:text-sm leading-relaxed bg-white">
      <h1 className="text-4xl italic text-black mb-8">Politique de Confidentialité</h1>

      <section className="space-y-4">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">1. Collecte des données personnelles</h2>
        <p>
          Nous recueillons uniquement les informations personnelles strictement nécessaires pour le traitement et la livraison de vos commandes en tant qu'invité (guest checkout) :
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Nom, prénom, adresse e-mail, numéro de téléphone.</li>
          <li>Adresse de livraison et adresse de facturation.</li>
          <li>Informations techniques (adresse IP anonymisée, type de navigateur via Plausible).</li>
        </ul>
      </section>

      <section className="space-y-4 border-t border-neutral-100 pt-8">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">2. Utilisation de vos données</h2>
        <p>
          Vos données personnelles sont traitées pour les finalités suivantes :
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Gestion des paiements sécurisés via Stripe.</li>
          <li>Expédition et suivi Colissimo de vos colis.</li>
          <li>Envoi automatique de la facture d'achat par Resend.</li>
          <li>Alerte de paniers abandonnés ou rappels liés à vos achats.</li>
        </ul>
      </section>

      <section className="space-y-4 border-t border-neutral-100 pt-8">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">3. Conservation des données</h2>
        <p>
          Les données de facturation sont conservées pendant une durée de 10 ans, conformément aux exigences du Code de commerce français. Les autres données liées à la livraison sont supprimées ou archivées de manière anonyme 3 ans après la fin de la relation commerciale.
        </p>
      </section>

      <section className="space-y-4 border-t border-neutral-100 pt-8">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">4. Destinataires des données</h2>
        <p>
          Vos données ne sont jamais vendues ou partagées à des fins marketing. Elles sont transmises uniquement à nos sous-traitants techniques impliqués dans l'exécution de vos commandes :
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li><strong className="text-black">Stripe</strong> (processeur de paiement sécurisé).</li>
          <li><strong className="text-black">La Poste / Colissimo</strong> (transporteur).</li>
          <li><strong className="text-black">Resend</strong> (envoi des e-mails transactionnels).</li>
          <li><strong className="text-black">Vercel</strong> (infrastructure d'hébergement).</li>
        </ul>
      </section>

      <section className="space-y-4 border-t border-neutral-100 pt-8">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">5. Vos droits (RGPD)</h2>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de portabilité, d'effacement de vos données personnelles ou de limitation de leur traitement.
        </p>
        <p>
          Pour exercer ces droits, vous pouvez nous adresser votre demande à l'adresse e-mail : <span className="text-black">contact@dreamframe.fr</span>.
        </p>
      </section>

      <p className="text-[10px] text-neutral-400 mt-12 pt-4 border-t border-neutral-150">
        Dernière mise à jour : 22 août 2026.
      </p>
    </main>
  )
}
