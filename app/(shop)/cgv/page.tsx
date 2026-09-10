import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente (CGV) — Dream Frame',
  description: 'Conditions générales de vente réglementant les achats sur la boutique Dream Frame.',
}

export default function CGVPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-10 text-neutral-600 text-xs sm:text-sm leading-relaxed bg-white">
      <h1 className="text-4xl italic text-black mb-8">Conditions Générales de Vente</h1>

      <section className="space-y-4">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">1. Objet & Champ d'application</h2>
        <p>
          Les présentes Conditions Générales de Vente (CGV) régissent de manière exclusive les relations contractuelles entre la boutique en ligne <strong className="text-black">Dream Frame</strong> (ci-après l'« Éditeur » ou le « Vendeur ») et toute personne effectuant un achat sur le site internet (ci-après l'« Acheteur » ou le « Client »).
        </p>
        <p>
          Le fait de valider une commande implique l'adhésion entière et sans réserve du Client aux présentes CGV. Le Vendeur livre exclusivement la <strong className="text-black">France métropolitaine</strong> en v1.
        </p>
      </section>

      <section className="space-y-4 border-t border-neutral-100 pt-8">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">2. Caractéristiques des Produits</h2>
        <p>
          Les produits proposés sont des cadres décoratifs au format A4 contenant une voiture miniature à l'échelle 1:24 et un système d'éclairage rétroéclairé LED (ci-après les « Cadres 3D » ou les « Produits »).
        </p>
        <p>
          Les photos et visuels du catalogue sont les plus fidèles possible mais n'engagent pas le Vendeur en cas d'infime variation de nuances de teintes ou de détails d'assemblage manuel.
        </p>
        <p>
          <strong className="text-black">Marquage CE :</strong> Les cadres comportant des éléments d'éclairage électrique par LED, ils sont conformes aux exigences de sécurité européennes applicables (directive compatibilité électromagnétique et basse tension).
        </p>
      </section>

      <section className="space-y-4 border-t border-neutral-100 pt-8">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">3. Prix & Facturation</h2>
        <p>
          Les prix sont indiqués en Euros et s'entendent toutes taxes comprises (TTC), au taux de TVA français de 20% applicable au jour de la commande.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Le prix de vente unitaire d'un cadre est fixé à <strong className="text-black font-semibold">40,00 € TTC</strong>.</li>
          <li>Les frais d'expédition via Colissimo suivi s'élèvent à <strong className="text-black font-semibold">5,90 € TTC</strong>.</li>
          <li>Les frais d'expédition sont offerts pour toute commande atteignant ou dépassant <strong className="text-black font-semibold">80,00 € TTC</strong> (soit 2 cadres).</li>
        </ul>
        <p>
          Chaque paiement validé donne lieu à l'émission d'une facture au format conforme envoyée automatiquement par courrier électronique.
        </p>
      </section>

      <section className="space-y-4 border-t border-neutral-100 pt-8">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">4. Commande & Sécurisation du Paiement</h2>
        <p>
          Les commandes s'effectuent sous le statut d'invité (guest checkout). Le paiement s'effectue par carte bancaire sur l'infrastructure de paiement sécurisée de notre partenaire <strong className="text-black">Stripe</strong>. Les transactions sont chiffrées selon le protocole SSL/TLS.
        </p>
        <p>
          Le contrat de vente est formé dès la validation définitive du paiement de la commande par notre processeur Stripe. Le débit de la carte bancaire est concomitant à la validation de la commande.
        </p>
      </section>

      <section className="space-y-4 border-t border-neutral-100 pt-8">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">5. Livraison & Stocks</h2>
        <p>
          Les livraisons sont limitées à la France métropolitaine. L'expédition a lieu sous 24/48h ouvrées par Colissimo Suivi de La Poste.
        </p>
        <p>
          L'assemblage des cadres étant manuel, le stock est décrémenté de façon atomique dès la confirmation de la transaction financière. En cas de rupture de stock exceptionnelle, le Client sera immédiatement contacté pour être remboursé sous 5 jours.
        </p>
      </section>

      <section className="space-y-4 border-t border-neutral-100 pt-8">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">6. Droit de rétractation (14 jours)</h2>
        <p>
          Conformément à l'article L. 221-18 du Code de la consommation, le Client dispose d'un délai de <strong className="text-black font-semibold">14 jours calendaires</strong> à compter de la réception de son produit pour exercer son droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités.
        </p>
        <p>
          Le Client doit renvoyer le produit intact, dans son emballage d'origine, à ses frais exclusifs. Pour exercer ce droit, le Client peut utiliser le formulaire disponible sur la page de rétractation ou adresser sa demande explicite par e-mail à <span className="text-black">contact@dreamframe.fr</span>.
        </p>
      </section>

      <section className="space-y-4 border-t border-neutral-100 pt-8">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">7. Garanties Légales</h2>
        <p>
          Nos produits bénéficient de la garantie légale de conformité (articles L. 217-3 et suivants du Code de la consommation) et de la garantie contre les vices cachés (articles 1641 et suivants du Code civil).
        </p>
      </section>

      <section className="space-y-4 border-t border-neutral-100 pt-8">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">8. Médiation de la consommation</h2>
        <p>
          Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, le Client consommateur a le droit de recourir gratuitement à un médiateur de la consommation agréé.
        </p>
        <p>
          Le médiateur de la consommation désigné par Dream Frame est le médiateur de la consommation :
        </p>
        <p className="font-bold text-black pl-4 border-l border-black">
          CM2C (Centre de la Médiation de la Consommation de Conciliateurs de Justice)<br />
          Site internet : https://www.cm2c.net/<br />
          Adresse : 49 Rue de Ponthieu, 75008 Paris
        </p>
      </section>

      <p className="text-[10px] text-neutral-400 mt-12 pt-4 border-t border-neutral-150">
        Dernière mise à jour : 22 août 2026.
      </p>
    </main>
  )
}
