import { PageTreeDocument, PageElement } from './types'

export const DEFAULT_PAGE_TREE: PageTreeDocument = {
  schemaVersion: 1,
  updatedAt: new Date().toISOString(),
  sections: [],
  elements: [
    // ─── 1. HERO SECTION ───────────────────────────────────────────────────────
    {
      id: 'hero-section',
      type: 'section',
      styles: {
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '80px',
        paddingBottom: '80px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#080807',
        backgroundImage: 'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.12) 0%, rgba(8, 8, 7, 0) 70%)',
        overflow: 'hidden',
      },
      responsiveStyles: {
        mobile: {
          paddingTop: '48px',
          paddingBottom: '48px',
          minHeight: '75vh',
        },
      },
      children: [
        {
          id: 'hero-container',
          type: 'container',
          styles: {
            maxWidth: '1000px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '24px',
          },
          children: [
            {
              id: 'hero-badge',
              type: 'badge',
              content: 'Atelier Français · Cadres Décoratifs Supercars',
              styles: {
                display: 'inline-flex',
                alignItems: 'center',
                paddingTop: '6px',
                paddingBottom: '6px',
                paddingLeft: '16px',
                paddingRight: '16px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                borderColor: 'rgba(245, 158, 11, 0.4)',
                borderWidth: '1px',
                borderStyle: 'solid',
                color: '#fbbf24',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              },
            },
            {
              id: 'hero-title',
              type: 'heading',
              tag: 'h1',
              content: "L'art de la supercar, sculpté en relief 3D.",
              styles: {
                color: '#ffffff',
                fontSize: '64px',
                fontWeight: '900',
                lineHeight: '1.05',
                letterSpacing: '-0.03em',
                textAlign: 'center',
                maxWidth: '900px',
              },
              responsiveStyles: {
                mobile: {
                  fontSize: '34px',
                  lineHeight: '1.15',
                },
              },
            },
            {
              id: 'hero-subtitle',
              type: 'text',
              tag: 'p',
              content:
                "Cadres d'ébénisterie automobile sous vitrage optique anti-UV avec rétroéclairage LED ambré intégré. À partir de 49,99 € · Livraison Colissimo 100% Offerte.",
              styles: {
                color: '#d4d4d8',
                fontSize: '16px',
                lineHeight: '1.6',
                fontWeight: '400',
                maxWidth: '680px',
                textAlign: 'center',
              },
              responsiveStyles: {
                mobile: {
                  fontSize: '14px',
                },
              },
            },
            {
              id: 'hero-cta-group',
              type: 'container',
              styles: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                marginTop: '12px',
                flexWrap: 'wrap',
              },
              children: [
                {
                  id: 'hero-cta-primary',
                  type: 'button',
                  content: 'Découvrir la Collection',
                  href: '/catalogue',
                  styles: {
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    fontSize: '13px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    paddingTop: '16px',
                    paddingBottom: '16px',
                    paddingLeft: '32px',
                    paddingRight: '32px',
                    borderRadius: '12px',
                    boxShadow: '0 20px 30px -10px rgba(255, 255, 255, 0.25)',
                  },
                },
                {
                  id: 'hero-cta-secondary',
                  type: 'button',
                  content: 'Créer mon Dream Frame',
                  href: '/configurateur',
                  styles: {
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    paddingTop: '16px',
                    paddingBottom: '16px',
                    paddingLeft: '28px',
                    paddingRight: '28px',
                    borderRadius: '12px',
                  },
                },
              ],
            },
            {
              id: 'hero-image-showcase',
              type: 'image',
              src: '/atelier/chiron-wall.jpg',
              alt: 'Bugatti Chiron — Art Automobile Dream Frame',
              styles: {
                width: '100%',
                maxWidth: '920px',
                aspectRatio: '16/9',
                borderRadius: '24px',
                objectFit: 'cover',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: '1px',
                borderStyle: 'solid',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
                marginTop: '16px',
              },
            },
          ],
        },
      ],
    },

    // ─── 2. PILIERS DE QUALITÉ ─────────────────────────────────────────────────
    {
      id: 'pillars-section',
      type: 'section',
      styles: {
        backgroundColor: '#0c0c0b',
        paddingTop: '64px',
        paddingBottom: '64px',
        paddingLeft: '24px',
        paddingRight: '24px',
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: '1px',
        borderStyle: 'solid',
      },
      children: [
        {
          id: 'pillars-container',
          type: 'container',
          styles: {
            maxWidth: '1200px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          },
          children: [
            {
              id: 'pillar-1',
              type: 'container',
              styles: {
                backgroundColor: 'rgba(20, 20, 19, 0.7)',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: '20px',
                paddingTop: '28px',
                paddingBottom: '28px',
                paddingLeft: '24px',
                paddingRight: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              },
              children: [
                {
                  id: 'pillar-1-badge',
                  type: 'text',
                  content: 'ÉBÉNISTERIE D’EXCEPTION',
                  styles: {
                    color: '#f59e0b',
                    fontSize: '11px',
                    fontWeight: '800',
                    letterSpacing: '0.12em',
                  },
                },
                {
                  id: 'pillar-1-title',
                  type: 'heading',
                  tag: 'h3',
                  content: 'Bois Massif & Finition Mat Profond',
                  styles: {
                    color: '#ffffff',
                    fontSize: '18px',
                    fontWeight: '800',
                  },
                },
                {
                  id: 'pillar-1-desc',
                  type: 'text',
                  content:
                    'Cadre noble assemblé avec une feuillure de 35 mm de profondeur permettant un relief 3D saisissant.',
                  styles: {
                    color: '#a1a1aa',
                    fontSize: '13px',
                    lineHeight: '1.6',
                  },
                },
              ],
            },
            {
              id: 'pillar-2',
              type: 'container',
              styles: {
                backgroundColor: 'rgba(20, 20, 19, 0.7)',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: '20px',
                paddingTop: '28px',
                paddingBottom: '28px',
                paddingLeft: '24px',
                paddingRight: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              },
              children: [
                {
                  id: 'pillar-2-badge',
                  type: 'text',
                  content: 'OPTIQUE HAUTE DÉFINITION',
                  styles: {
                    color: '#38bdf8',
                    fontSize: '11px',
                    fontWeight: '800',
                    letterSpacing: '0.12em',
                  },
                },
                {
                  id: 'pillar-2-title',
                  type: 'heading',
                  tag: 'h3',
                  content: 'Vitrage Verre Véritable Anti-Reflet',
                  styles: {
                    color: '#ffffff',
                    fontSize: '18px',
                    fontWeight: '800',
                  },
                },
                {
                  id: 'pillar-2-desc',
                  type: 'text',
                  content:
                    'Protection intégrale contre les UV pour une conservation parfaite des teintes d’origine sans décoloration.',
                  styles: {
                    color: '#a1a1aa',
                    fontSize: '13px',
                    lineHeight: '1.6',
                  },
                },
              ],
            },
            {
              id: 'pillar-3',
              type: 'container',
              styles: {
                backgroundColor: 'rgba(20, 20, 19, 0.7)',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: '20px',
                paddingTop: '28px',
                paddingBottom: '28px',
                paddingLeft: '24px',
                paddingRight: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              },
              children: [
                {
                  id: 'pillar-3-badge',
                  type: 'text',
                  content: 'EXPÉDITION BLINDÉE',
                  styles: {
                    color: '#10b981',
                    fontSize: '11px',
                    fontWeight: '800',
                    letterSpacing: '0.12em',
                  },
                },
                {
                  id: 'pillar-3-title',
                  type: 'heading',
                  tag: 'h3',
                  content: 'Colissimo 100% Offert & Assuré',
                  styles: {
                    color: '#ffffff',
                    fontSize: '18px',
                    fontWeight: '800',
                  },
                },
                {
                  id: 'pillar-3-desc',
                  type: 'text',
                  content:
                    'Double emballage amortisseur sur-mesure. Livraison suivie garantie sans aucun bris de verre.',
                  styles: {
                    color: '#a1a1aa',
                    fontSize: '13px',
                    lineHeight: '1.6',
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    // ─── 3. DÉMONSTRATION INTERACTIVE 3D & ÉCLAIRAGE LED ───────────────────────
    {
      id: 'demo-section',
      type: 'section',
      styles: {
        backgroundColor: '#080807',
        paddingTop: '64px',
        paddingBottom: '64px',
        paddingLeft: '24px',
        paddingRight: '24px',
      },
    },

    // ─── 4. DYNAMIC COLLECTION SECTION ─────────────────────────────────────────
    {
      id: 'collection-section',
      type: 'section',
      styles: {
        backgroundColor: '#080807',
        paddingTop: '88px',
        paddingBottom: '88px',
        paddingLeft: '24px',
        paddingRight: '24px',
      },
      children: [
        {
          id: 'collection-header',
          type: 'container',
          styles: {
            maxWidth: '800px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '12px',
            marginBottom: '48px',
          },
          children: [
            {
              id: 'collection-badge',
              type: 'text',
              content: 'CATALOGUE COLLECTOR 2026',
              styles: {
                color: '#f59e0b',
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              },
            },
            {
              id: 'collection-title',
              type: 'heading',
              tag: 'h2',
              content: 'Les Légendes Automobiles en Édition Limitée',
              styles: {
                color: '#ffffff',
                fontSize: '42px',
                fontWeight: '900',
                letterSpacing: '-0.02em',
              },
              responsiveStyles: {
                mobile: {
                  fontSize: '28px',
                },
              },
            },
            {
              id: 'collection-desc',
              type: 'text',
              content:
                'Chaque cadre est numéroté et livré prêt à poser au mur ou sur un meuble. Choisissez votre modèle favori.',
              styles: {
                color: '#a1a1aa',
                fontSize: '15px',
                maxWidth: '600px',
              },
            },
          ],
        },
        // Dynamic Product List Element!
        {
          id: 'collection-product-list',
          type: 'product-list',
          productListConfig: {
            category: 'ALL',
            limit: 8,
            sortBy: 'featured',
          },
          styles: {
            maxWidth: '1300px',
            width: '100%',
          },
        },
      ],
    },

    // ─── 4. REASSURANCE & ENGAGEMENTS ──────────────────────────────────────────
    {
      id: 'reassurance-section',
      type: 'section',
      styles: {
        backgroundColor: '#0e0e0d',
        paddingTop: '64px',
        paddingBottom: '64px',
        paddingLeft: '24px',
        paddingRight: '24px',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: '1px',
        borderStyle: 'solid',
      },
      children: [
        {
          id: 'reassurance-container',
          type: 'container',
          styles: {
            maxWidth: '1000px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '20px',
          },
          children: [
            {
              id: 'reassurance-title',
              type: 'heading',
              tag: 'h3',
              content: 'Un Projet Spécifique ? Créez Votre Propre Supercar.',
              styles: {
                color: '#ffffff',
                fontSize: '32px',
                fontWeight: '900',
              },
              responsiveStyles: {
                mobile: {
                  fontSize: '24px',
                },
              },
            },
            {
              id: 'reassurance-desc',
              type: 'text',
              content:
                'Notre atelier réalise votre cadre sur-mesure à partir de votre véhicule personnel ou d’une configuration collector rare.',
              styles: {
                color: '#a1a1aa',
                fontSize: '15px',
                maxWidth: '620px',
              },
            },
            {
              id: 'reassurance-btn',
              type: 'button',
              content: 'Lancer le Configurateur Sur-Mesure',
              href: '/configurateur',
              styles: {
                backgroundColor: '#f59e0b',
                color: '#000000',
                fontSize: '13px',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                paddingTop: '16px',
                paddingBottom: '16px',
                paddingLeft: '32px',
                paddingRight: '32px',
                borderRadius: '12px',
                boxShadow: '0 15px 30px -8px rgba(245, 158, 11, 0.35)',
                marginTop: '8px',
              },
            },
          ],
        },
      ],
    },
  ],
}
