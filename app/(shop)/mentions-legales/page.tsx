import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions Légales — Dream Frame',
  description: 'Mentions légales de la boutique en ligne Dream Frame. Éditeur, hébergeur et crédits.',
}

export default function MentionsLegalesPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-10 text-neutral-600 text-xs sm:text-sm leading-relaxed bg-white">
      <h1 className="text-4xl font-serif italic text-black mb-8">Mentions Légales</h1>

      <section className="space-y-4">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">1. Éditeur du site</h2>
        <p>
          La boutique en ligne <strong className="text-black">Dream Frame</strong> est éditée par le fondateur de Dream Frame.
        </p>
        <p>
          Forme juridique : Auto-entrepreneur (en cours d'immatriculation / SIRET à renseigner par le client).
        </p>
        <p>
          Adresse e-mail de contact : <span className="text-black font-semibold">contact@dreamframe.fr</span>
        </p>
      </section>

      <section className="space-y-4 border-t border-neutral-100 pt-8">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">2. Hébergeur</h2>
        <p>
          Le site internet est hébergé par <strong className="text-black">Vercel Inc.</strong>
        </p>
        <p>Adresse postale de l'hébergeur :</p>
        <address className="not-italic text-neutral-500 font-mono pl-4 border-l border-neutral-200">
          Vercel Inc.<br />
          340 S Lemon Ave #4133<br />
          Walnut, CA 91789<br />
          États-Unis
        </address>
      </section>

      <section className="space-y-4 border-t border-neutral-100 pt-8">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">3. Propriété intellectuelle</h2>
        <p>
          L'intégralité du site (textes, design graphique, logos, marque Dream Frame) est protégée par les lois relatives à la propriété intellectuelle. Toute reproduction, représentation ou modification sans accord écrit préalable de l'éditeur est strictement interdite.
        </p>
      </section>

      <section className="space-y-4 border-t border-neutral-100 pt-8">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">4. Éco-participation & DEEE</h2>
        <p>
          Dream Frame distribue des produits intégrant des dispositifs d'éclairage électrique (LED). Conformément à la réglementation française sur les déchets d'équipements électriques et électroniques (DEEE), le prix de vente inclut le coût de l'éco-participation. Ne jetez pas ces produits avec les déchets municipaux non triés. Veuillez utiliser les points de collecte prévus à cet effet.
        </p>
      </section>

      <p className="text-[10px] text-neutral-400 mt-12 pt-4 border-t border-neutral-150">
        Dernière mise à jour : 22 août 2026.
      </p>
    </main>
  )
}
