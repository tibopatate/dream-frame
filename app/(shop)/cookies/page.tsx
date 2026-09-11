import type { Metadata } from 'next'
import { Cookie, ShieldCheck, Settings, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Politique des Cookies & Traceurs — Dream Frame Officiel',
  description: 'Politique d\'utilisation des cookies, traceurs techniques et respect de la vie privée sur Dream Frame.',
}

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#080807] text-white selection:bg-amber-400 selection:text-black py-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-12 w-full overflow-hidden">
        {/* En-tête */}
        <div className="space-y-4 border-b border-neutral-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-mono uppercase tracking-wider">
            <Cookie className="w-3.5 h-3.5" />
            <span>Gestion des Traceurs</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Politique de Cookies
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Dream Frame adopte une approche éthique et minimaliste : aucun cookie publicitaire intrusif, zéro pistage tiers non consenti.
          </p>
        </div>

        {/* 1. Qu'est-ce qu'un cookie ? */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="text-amber-400 font-mono text-sm">01.</span> Qu&apos;est-ce qu&apos;un cookie technique ?
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Un cookie est un petit fichier texte déposé sur votre terminal lors de votre navigation. Il permet au site de mémoriser temporairement votre panier de cadres d&apos;art et de sécuriser la procédure de paiement sans nécessiter de reconnexion permanente.
          </p>
        </section>

        {/* 2. Liste des traceurs utilisés */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="text-amber-400 font-mono text-sm">02.</span> Traceurs Utilisés sur Dream Frame
          </h2>

          <div className="space-y-4">
            <div className="bg-neutral-950/60 p-5 rounded-xl border border-neutral-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Cookies Techniques &amp; Fonctionnels
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Strictement Nécessaires
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Permettent le fonctionnement de base : persistance du panier d&apos;achat d&apos;une page à l&apos;autre, sécurisation anti-fraude des formulaires de paiement Stripe et token d&apos;authentification administrateur. Exemptés de consentement selon les recommandations de la CNIL.
              </p>
            </div>

            <div className="bg-neutral-950/60 p-5 rounded-xl border border-neutral-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  Mesure d&apos;Audience Anonymisée
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Sans Cookies Publicitaires
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Nous mesurons la performance de notre site sans poser de traceurs tiers invasifs ni profiler nos visiteurs. Les données d&apos;audience sont strictement agrégées et anonymes, respectant la vie privée dès la conception (Privacy by Design).
              </p>
            </div>
          </div>
        </section>

        {/* 3. Contrôle & Gestion */}
        <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-mono text-sm">03.</span> Gestion de Vos Préférences
          </h2>
          <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <p>
              Vous pouvez à tout moment configurer votre navigateur pour bloquer les cookies ou supprimer ceux déjà stockés :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-400">
              <li><strong className="text-neutral-200">Google Chrome :</strong> Paramètres &gt; Confidentialité et sécurité &gt; Cookies et données de sites.</li>
              <li><strong className="text-neutral-200">Apple Safari :</strong> Préférences &gt; Confidentialité &gt; Bloquer tous les cookies.</li>
              <li><strong className="text-neutral-200">Mozilla Firefox :</strong> Paramètres &gt; Vie privée et sécurité &gt; Cookies et données de sites.</li>
            </ul>
            <p className="text-xs text-amber-300/80 pt-1">
              Attention : Le blocage des cookies techniques indispensables peut empêcher la mise au panier de vos cadres et le paiement sécurisé.
            </p>
          </div>
        </section>

        {/* Bas de page */}
        <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-400">
          <p>Dernière mise à jour : 11 septembre 2026</p>
          <p className="font-mono text-neutral-400">Dream Frame — Conformité RGPD &amp; e-Privacy</p>
        </div>
      </div>
    </main>
  )
}

