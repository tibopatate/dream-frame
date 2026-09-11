import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Atelier Sur-Mesure — Créez Votre Cadre 3D Personnalisé | Dream Frame Officiel',
  description:
    'Personnalisez votre cadre 3D automobile d’exception en direct : choisissez votre modèle, les dimensions, la finition bois ou aluminium et l’échelle miniature. Atelier artisanal en France.',
  alternates: {
    canonical: 'https://dreamframeofficiel.com/configurateur',
  },
}

export default function ConfigurateurLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
