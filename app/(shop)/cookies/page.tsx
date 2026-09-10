import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de Cookies — Dream Frame',
  description: 'Politique d\'utilisation des traceurs et cookies de la boutique Dream Frame.',
}

export default function CookiesPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-10 text-neutral-600 text-xs sm:text-sm leading-relaxed bg-white">
      <h1 className="text-4xl italic text-black mb-8">Politique de Cookies</h1>

      <section className="space-y-4">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">1. Qu'est-ce qu'un cookie ?</h2>
        <p>
          Un cookie est un petit fichier texte stocké sur votre terminal (ordinateur, tablette ou smartphone) lors de la visite d'un site internet. Il permet au site de mémoriser des données sur vos préférences et vos actions durant une période donnée.
        </p>
      </section>

      <section className="space-y-4 border-t border-neutral-100 pt-8">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">2. Cookies utilisés sur notre site</h2>
        <p>
          Dream Frame limite l'usage de cookies au strict minimum. Nous utilisons uniquement :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong className="text-black">Cookies techniques & fonctionnels :</strong> Essentiels au fonctionnement du panier d'achat (mémorisation de vos cadres ajoutés au panier) et à la sécurisation des formulaires de paiement Stripe. Ces cookies sont exemptés de consentement.
          </li>
          <li>
            <strong className="text-black">Cookies de session admin :</strong> Nécessaires au fonctionnement de l'authentification sécurisée de l'administrateur (NextAuth/Auth.js).
          </li>
          <li>
            <strong className="text-black">Analyses d'audience (sans cookies tiers) :</strong> Nous utilisons <strong className="text-black">Plausible Analytics</strong> pour mesurer les performances du site de façon anonyme. Plausible respecte le RGPD, n'utilise pas de cookies et ne collecte aucune donnée personnelle identifiable.
          </li>
        </ul>
      </section>

      <section className="space-y-4 border-t border-neutral-100 pt-8">
        <h2 className="text-xs font-bold text-black uppercase tracking-wider">3. Gestion de vos préférences</h2>
        <p>
          Vous pouvez à tout moment configurer votre navigateur pour accepter ou refuser globalement les cookies, ou pour supprimer les cookies existants enregistrés sur votre terminal.
        </p>
        <p>
          Notez que si vous désactivez l'ensemble des cookies techniques, vous ne pourrez plus ajouter de produits à votre panier ni passer de commande sur notre boutique.
        </p>
      </section>

      <p className="text-[10px] text-neutral-400 mt-12 pt-4 border-t border-neutral-150">
        Dernière mise à jour : 22 août 2026.
      </p>
    </main>
  )
}
