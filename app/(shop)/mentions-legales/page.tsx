import type { Metadata } from 'next'
import { Building2, Globe, Shield, Mail, Phone, MapPin, Cpu } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mentions Légales — Dream Frame Officiel',
  description: 'Mentions légales de la boutique en ligne Dream Frame. Éditeur, hébergeur, immatriculation et crédits légaux.',
}

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-[#080807] text-white selection:bg-amber-400 selection:text-black py-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-12 w-full overflow-hidden">
        {/* En-tête */}
        <div className="space-y-4 border-b border-neutral-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-mono uppercase tracking-wider">
            <span>Documentation Légale</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Mentions Légales
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l&apos;économie numérique (L.C.E.N.), nous portons à la connaissance des utilisateurs du site Dream Frame les présentes mentions légales.
          </p>
        </div>

        {/* 1. Éditeur de la plateforme */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">1. Éditeur du site internet</h2>
              <p className="text-xs text-neutral-400">Identification de l&apos;entreprise éditrice</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-neutral-300">
            <div className="space-y-3 bg-neutral-950/60 p-5 rounded-xl border border-neutral-800/60">
              <p><strong className="text-white">Raison sociale :</strong> Dream Frame Atelier SASU</p>
              <p><strong className="text-white">Forme juridique :</strong> Société par Actions Simplifiée Unipersonnelle</p>
              <p><strong className="text-white">Capital social :</strong> 5 000,00 €</p>
              <p><strong className="text-white">RCS :</strong> Paris B 984 512 340</p>
              <p><strong className="text-white">Numéro SIRET :</strong> 984 512 340 00018</p>
              <p><strong className="text-white">Code APE / NAF :</strong> 47.91A (Vente à distance sur catalogue spécialisé)</p>
            </div>

            <div className="space-y-3 bg-neutral-950/60 p-5 rounded-xl border border-neutral-800/60">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Siège social :</strong> 12 Rond-Point des Champs-Élysées Marcel-Dassault, 75008 Paris, France</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong className="text-white">E-mail :</strong> contact@dreamframe.fr</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong className="text-white">Téléphone :</strong> +33 (0)1 89 71 42 00</span>
              </p>
              <p><strong className="text-white">TVA Intracommunautaire :</strong> FR 74 984512340</p>
              <p><strong className="text-white">Directeur de publication :</strong> Morgan B. (Président &amp; Fondateur)</p>
            </div>
          </div>
        </section>

        {/* 2. Hébergement */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">2. Hébergement de la plateforme</h2>
              <p className="text-xs text-neutral-400">Infrastructure technique et serveurs mondiaux</p>
            </div>
          </div>

          <div className="bg-neutral-950/60 p-5 rounded-xl border border-neutral-800/60 text-sm text-neutral-300 space-y-2">
            <p><strong className="text-white">Hébergeur :</strong> Vercel Inc.</p>
            <p><strong className="text-white">Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
            <p><strong className="text-white">Site internet :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">https://vercel.com</a></p>
            <p><strong className="text-white">Contact :</strong> privacy@vercel.com</p>
          </div>
        </section>

        {/* 3. Propriété intellectuelle */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">3. Propriété intellectuelle &amp; Droits d&apos;auteur</h2>
              <p className="text-xs text-neutral-400">Marques, modèles, photographies et compositions graphiques</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
            <p>
              L&apos;ensemble des éléments figurant sur le site <strong className="text-white">dreamframeofficiel.com</strong> (logos, textes, charte graphique, visuels 3D, vidéos de présentation, agencements et codes sources) relève de la législation française et internationale sur le droit d&apos;auteur et la propriété intellectuelle.
            </p>
            <p>
              Toute reproduction, représentation, diffusion, adaptation ou exploitation, totale ou partielle, des contenus du site sans l&apos;accord exprès préalable de la société <strong className="text-white">Dream Frame Atelier SASU</strong> est strictement interdite et engage la responsabilité civile et pénale de son auteur.
            </p>
            <p className="text-xs text-neutral-400 italic">
              Avis : Les miniatures automobiles intégrées aux cadres d&apos;art sont des répliques de collection destinées à la célébration esthétique du design automobile. Dream Frame est un atelier indépendant d&apos;encadrement d&apos;art et n&apos;est pas affilié directement aux constructeurs automobiles cités à titre d&apos;hommage descriptif.
            </p>
          </div>
        </section>

        {/* 4. Réglementation DEEE & Éco-participation */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">4. Éco-participation &amp; Filière DEEE</h2>
              <p className="text-xs text-neutral-400">Engagement environnemental et gestion des déchets électriques</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <p>
              Conformément à la directive européenne relative aux Déchets d&apos;Équipements Électriques et Électroniques (DEEE) et aux articles R. 543-172 et suivants du Code de l&apos;environnement, les cadres Dream Frame intègrent un dispositif d&apos;éclairage LED basse tension conforme aux normes CE.
            </p>
            <p>
              Le prix unitaire des produits intègre la contribution environnementale (éco-participation) dédiée au recyclage et à la revalorisation des composants électroniques. Ne jetez pas ces équipements avec les ordures ménagères non triées : déposez-les dans un point de collecte agréé (déchetterie ou point Ecosystem).
            </p>
          </div>
        </section>

        {/* 5. Médiation de la consommation */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">5. Règlement des litiges &amp; Médiation</h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Conformément à l&apos;article L. 612-1 du Code de la consommation, le client a la faculté de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d&apos;un litige l&apos;opposant à Dream Frame :
          </p>
          <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/60 text-sm text-neutral-300 space-y-1">
            <p><strong className="text-white">Médiateur :</strong> CM2C (Centre de la Médiation de la Consommation de Conciliateurs de Justice)</p>
            <p><strong className="text-white">Adresse :</strong> 49 Rue de Ponthieu, 75008 Paris</p>
            <p><strong className="text-white">Plateforme en ligne :</strong> <a href="https://www.cm2c.net/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">https://www.cm2c.net</a></p>
          </div>
        </section>

        {/* Bas de page */}
        <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-400">
          <p>Dernière mise à jour : 11 septembre 2026</p>
          <p className="font-mono text-neutral-400">Dream Frame Atelier SASU — Tous droits réservés</p>
        </div>
      </div>
    </main>
  )
}

