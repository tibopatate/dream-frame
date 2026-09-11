import type { Metadata } from 'next'
import { FileCheck, ShieldAlert, CreditCard, Truck, RotateCcw, Scale, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente (CGV) — Dream Frame Officiel',
  description: 'Conditions générales de vente réglementant les achats sur la boutique officielle Dream Frame.',
}

export default function CGVPage() {
  return (
    <main className="min-h-screen bg-[#080807] text-white selection:bg-amber-400 selection:text-black py-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-12 w-full overflow-hidden">
        {/* En-tête */}
        <div className="space-y-4 border-b border-neutral-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-mono uppercase tracking-wider">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Cadre Contractuel</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Conditions Générales de Vente
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Les présentes Conditions Générales de Vente régissent l&apos;ensemble des relations contractuelles entre la boutique officielle Dream Frame et ses clients.
          </p>
        </div>

        {/* 1. Objet & Champ d'application */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="text-amber-400 font-mono text-sm">01.</span> Objet &amp; Champ d&apos;application
          </h2>
          <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent de manière exclusive les relations contractuelles entre la boutique en ligne <strong className="text-white">Dream Frame</strong> (exploitée par la société <strong className="text-white">Dream Frame Atelier SASU</strong>, ci-après « le Vendeur ») et toute personne physique ou morale effectuant un achat sur le site officiel <strong className="text-white">dreamframeofficiel.com</strong> (ci-après « le Client » ou « l&apos;Acheteur »).
            </p>
            <p>
              Toute commande passée sur le site implique l&apos;adhésion pleine, entière et sans réserve du Client aux présentes conditions. La livraison s&apos;effectue en France métropolitaine, Corse et pays de l&apos;Union Européenne éligibles.
            </p>
          </div>
        </section>

        {/* 2. Caractéristiques des Produits */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="text-amber-400 font-mono text-sm">02.</span> Caractéristiques des Produits &amp; Conformité
          </h2>
          <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <p>
              Les produits proposés sont des cadres décoratifs 3D d&apos;art automobile au format galerie, intégrant une miniature de collection minutieusement fixée, un éclairage rétroéclairé LED basse tension et une vitre de protection.
            </p>
            <p>
              Chaque pièce étant confectionnée et vérifiée à la main dans notre atelier, d&apos;infimes variations de texture ou de nuances de colorimétrie peuvent exister par rapport aux photographies d&apos;illustration, attestant de l&apos;authenticité artisanale du produit.
            </p>
            <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/60 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-neutral-300">
                <strong className="text-white">Conformité Européenne (Norme CE) :</strong> Les cadres équipés de modules électroniques respectent rigoureusement les directives européennes de sécurité basse tension (LVD) et de compatibilité électromagnétique (EMC).
              </p>
            </div>
          </div>
        </section>

        {/* 3. Prix & Facturation */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="text-amber-400 font-mono text-sm">03.</span> Tarifs &amp; Modalités de Facturation
          </h2>
          <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <p>
              Les tarifs applicables sont ceux affichés sur le site au moment de la passation de la commande. Tous les prix sont stipulés en Euros (€) Toutes Taxes Comprises (TTC), au taux de TVA en vigueur au jour de la validation d&apos;achat.
            </p>
            <ul className="space-y-2 bg-neutral-950/60 p-5 rounded-xl border border-neutral-800/60">
              <li className="flex items-center justify-between text-neutral-300">
                <span>Prix unitaire catalogue standard :</span>
                <span className="font-semibold text-white">49,90 € TTC</span>
              </li>
              <li className="flex items-center justify-between text-neutral-300">
                <span>Frais de livraison Colissimo Suivie :</span>
                <span className="font-semibold text-emerald-400">100% Offerte (0,00 €)</span>
              </li>
              <li className="flex items-center justify-between text-neutral-300">
                <span>Facture d&apos;achat officielle :</span>
                <span className="text-neutral-400">Générée et adressée immédiatement par e-mail</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 4. Commande & Paiement Sécurisé */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-mono text-sm">04.</span> Commande &amp; Sécurisation Bancaire
          </h2>
          <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <p>
              Les achats s&apos;effectuent de façon fluide sous le mode invité sécurisé (Guest Checkout). La validation définitive de la commande intervient lors du débit effectif du compte bancaire de l&apos;Acheteur.
            </p>
            <p>
              Les transactions sont opérées via l&apos;infrastructure certifiée PCI-DSS niveau 1 de notre partenaire financier <strong className="text-white">Stripe</strong>. Les coordonnées bancaires sont chiffrées selon le protocole de chiffrement TLS 256 bits et ne transitent à aucun moment sur les serveurs de Dream Frame.
            </p>
          </div>
        </section>

        {/* 5. Livraison & Délais */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-mono text-sm">05.</span> Expédition &amp; Livraison Colissimo
          </h2>
          <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <p>
              Toutes les commandes sont préparées, contrôlées et expédiées sous 24 à 48 heures ouvrées. L&apos;acheminement s&apos;effectue par le service Colissimo avec numéro de suivi transmis en temps réel.
            </p>
            <p>
              En cas de colis endommagé lors du transport, le Client est invité à notifier ses réserves auprès du transporteur et à contacter le support sous 48 heures à <span className="text-amber-400 font-mono">contact@dreamframe.fr</span> avec photographies du colis.
            </p>
          </div>
        </section>

        {/* 6. Droit de Rétractation */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-mono text-sm">06.</span> Droit de Rétractation de 14 Jours
          </h2>
          <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <p>
              Conformément à l&apos;article L. 221-18 du Code de la consommation, le Client dispose d&apos;un délai légal de <strong className="text-white">14 jours calendaires</strong> à compter du jour de la réception du colis pour notifier sa volonté de se rétracter sans avoir à motiver sa décision.
            </p>
            <p>
              Les articles doivent être retournés complets, dans leur emballage d&apos;origine intact et en parfait état de revente. Le remboursement intégral est exécuté dans un délai maximal de 14 jours suivant la réception et le contrôle de conformité en atelier.
            </p>
          </div>
        </section>

        {/* 7. Garanties Légales */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-mono text-sm">07.</span> Garanties Légales de Conformité &amp; Vices Cachés
          </h2>
          <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <p>
              Le Vendeur est garant de la conformité du produit vendu selon les articles L. 217-4 et suivants du Code de la consommation, ainsi que des défauts cachés de la chose vendue conformément aux articles 1641 et suivants du Code civil.
            </p>
            <p>
              En cas de non-conformité avérée ou de défectuosité du système d&apos;éclairage LED sous garantie légale de 2 ans, le produit est remplacé ou réparé sans aucuns frais pour le Client.
            </p>
          </div>
        </section>

        {/* 8. Litiges & Médiation */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-mono text-sm">08.</span> Règlement Amiable des Litiges &amp; Médiation
          </h2>
          <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <p>
              En cas de réclamation, le Client s&apos;adresse en priorité au service client de Dream Frame par e-mail à <span className="text-amber-400 font-mono">contact@dreamframe.fr</span>.
            </p>
            <p>
              À défaut d&apos;accord amiable sous un délai de 30 jours, le consommateur peut s&apos;adresser gratuitement au médiateur de la consommation : CM2C (Centre de la Médiation de la Consommation de Conciliateurs de Justice), 49 Rue de Ponthieu, 75008 Paris (<a href="https://www.cm2c.net/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">www.cm2c.net</a>).
            </p>
          </div>
        </section>

        {/* Bas de page */}
        <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-400">
          <p>Dernière révision : 11 septembre 2026</p>
          <p className="font-mono text-neutral-400">Dream Frame Atelier SASU — Document Contractuel Officiel</p>
        </div>
      </div>
    </main>
  )
}

