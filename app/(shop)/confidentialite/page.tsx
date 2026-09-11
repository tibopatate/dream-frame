import type { Metadata } from 'next'
import { Lock, Shield, Database, Clock, Server, UserCheck, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité & RGPD — Dream Frame Officiel',
  description: 'Politique de confidentialité et engagement de protection des données personnelles (RGPD) de Dream Frame.',
}

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-[#080807] text-white selection:bg-amber-400 selection:text-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* En-tête */}
        <div className="space-y-4 border-b border-neutral-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-mono uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Protection des Données &amp; RGPD</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Politique de Confidentialité
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            La protection de votre vie privée et de vos données personnelles est au cœur de nos engagements d&apos;excellence. Découvrez comment vos informations sont sécurisées.
          </p>
        </div>

        {/* 1. Collecte des données */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">1. Collecte Minimale des Données</h2>
              <p className="text-xs text-neutral-400">Principe de minimisation (RGPD Article 5)</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <p>
              Nous limitons rigoureusement la collecte aux informations strictement indispensables pour préparer, acheminer et facturer vos commandes de cadres 3D :
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <li className="bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/60 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span><strong className="text-white">Identité :</strong> Nom, prénom</span>
              </li>
              <li className="bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/60 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span><strong className="text-white">Contact :</strong> Adresse e-mail, téléphone mobile</span>
              </li>
              <li className="bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/60 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span><strong className="text-white">Logistique :</strong> Adresse complète de livraison</span>
              </li>
              <li className="bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/60 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span><strong className="text-white">Facturation :</strong> Adresse postale de facturation</span>
              </li>
            </ul>
            <p className="text-xs text-neutral-400 pt-1">
              Note : Aucune création de mot de passe n&apos;est exigée lors de votre achat grâce à notre système sécurisé de commande rapide invité.
            </p>
          </div>
        </section>

        {/* 2. Finalités du traitement */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">2. Finalités &amp; Utilisation</h2>
              <p className="text-xs text-neutral-400">Objectifs opérationnels du traitement</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <p>Vos données sont exploitées pour les finalités légitimes suivantes :</p>
            <div className="space-y-2 bg-neutral-950/60 p-5 rounded-xl border border-neutral-800/60">
              <p className="flex items-center gap-2">
                <span className="text-emerald-400">✔</span> Traitement sécurisé du paiement par carte bancaire via Stripe.
              </p>
              <p className="flex items-center gap-2">
                <span className="text-emerald-400">✔</span> Édition des bordereaux d&apos;expédition et suivi Colissimo La Poste.
              </p>
              <p className="flex items-center gap-2">
                <span className="text-emerald-400">✔</span> Envoi de confirmation de commande et factures par e-mail.
              </p>
              <p className="flex items-center gap-2">
                <span className="text-emerald-400">✔</span> Assistance réactive par notre service client en cas de questions.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Conservation des données */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">3. Durées de Conservation</h2>
              <p className="text-xs text-neutral-400">Respect des obligations fiscales et légales</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <p>
              Les données relatives aux factures et pièces comptables sont archivées pendant <strong className="text-white">10 ans</strong> conformément aux obligations du Code de commerce (Article L. 123-22).
            </p>
            <p>
              Les informations de livraison et d&apos;échanges avec le service client sont conservées pour une durée maximale de <strong className="text-white">3 ans</strong> après la dernière commande, après quoi elles sont supprimées de façon irréversible.
            </p>
          </div>
        </section>

        {/* 4. Sous-traitants techniques */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">4. Destinataires &amp; Partenaires Certifiés</h2>
              <p className="text-xs text-neutral-400">Zéro revente de vos données</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <p>
              Dream Frame ne vend, ne loue et ne cède jamais vos informations personnelles à des tiers. Les transferts s&apos;effectuent uniquement avec les prestataires techniques nécessaires à l&apos;exécution du service :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/60">
                <p className="font-semibold text-white">Stripe Payments</p>
                <p className="text-xs text-neutral-400">Traitement chiffré des règlements bancaires</p>
              </div>
              <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/60">
                <p className="font-semibold text-white">La Poste / Colissimo</p>
                <p className="text-xs text-neutral-400">Acheminement et livraison suivie à domicile</p>
              </div>
              <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/60">
                <p className="font-semibold text-white">Vercel Inc.</p>
                <p className="text-xs text-neutral-400">Hébergement cloud sécurisé hautement disponible</p>
              </div>
              <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/60">
                <p className="font-semibold text-white">Resend Communications</p>
                <p className="text-xs text-neutral-400">Distribution sécurisée des e-mails d&apos;achat</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Droits RGPD */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">5. Vos Droits &amp; Contact DPO</h2>
              <p className="text-xs text-neutral-400">Exercice simple et garanti de vos droits</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD 2016/679) et à la loi Informatique et Libertés, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-300">
              <li>Droit d&apos;accès et de communication de l&apos;ensemble de vos données.</li>
              <li>Droit de rectification et de mise à jour de vos coordonnées.</li>
              <li>Droit à l&apos;effacement (droit à l&apos;oubli) sous réserve des délais légaux de conservation fiscale.</li>
              <li>Droit à la limitation du traitement et d&apos;opposition.</li>
            </ul>
            <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/60 flex items-center gap-3">
              <Mail className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-xs text-neutral-300">
                Pour exercer l&apos;un de ces droits, contactez notre référent à : <a href="mailto:contact@dreamframe.fr" className="text-amber-400 font-semibold hover:underline">contact@dreamframe.fr</a>. Une réponse vous sera apportée sous 72 heures.
              </p>
            </div>
          </div>
        </section>

        {/* Bas de page */}
        <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-400">
          <p>Dernière mise à jour : 11 septembre 2026</p>
          <p className="font-mono text-neutral-400">Dream Frame — Registre de Confidentialité RGPD</p>
        </div>
      </div>
    </main>
  )
}

