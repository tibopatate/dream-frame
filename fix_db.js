const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const record = await prisma.setting.findUnique({ where: { key: 'page_tree_published' } })
  if (record && record.value && record.value.sections) {
    let sections = record.value.sections
    
    // Add if missing
    if (!sections.find(s => s.type === 'interiors')) {
      sections.push({
        id: 'sec-interiors',
        type: 'interiors',
        name: 'Laissez-les sublimer votre pièce',
        settings: {
          title: 'Laissez les sublimer votre pièce',
          desc: 'Découvrez comment nos cadres d’exception s’intègrent parfaitement dans tout type d’intérieur.',
        },
      })
    }
    if (!sections.find(s => s.type === 'about')) {
      sections.push({
        id: 'sec-about',
        type: 'about',
        name: 'Qui sommes nous',
        settings: {
          title: 'Qui sommes-nous ?',
          desc: "Dream Frame est né d\'une passion commune pour l\'automobile et l\'artisanat français. Nous concevons et assemblons chaque cadre à la main dans notre atelier, avec une exigence de qualité absolue.",
        },
      })
    }
    if (!sections.find(s => s.type === 'faq')) {
      sections.push({
        id: 'sec-faq',
        type: 'faq',
        name: 'Foire Aux Questions',
        settings: {
          title: 'Questions Fréquentes',
          q1: 'Quels sont les délais de livraison ?',
          a1: "Chaque cadre étant assemblé à la main à la demande, il faut compter 4 à 6 jours ouvrés pour la fabrication et l\'expédition.",
          q2: "Comment s\'alimente le rétroéclairage LED ?",
          a2: "Nos cadres sont fournis avec une batterie discrète rechargeable par USB-C, garantissant un rendu propre sans câble apparent.",
          q3: 'Puis-je commander un modèle spécifique ?',
          a3: 'Oui, notre atelier sur-mesure vous permet de configurer le cadre avec le véhicule de votre choix.',
        },
      })
    }
    
    await prisma.setting.update({
      where: { key: 'page_tree_published' },
      data: { value: { ...record.value, sections } }
    })
    console.log("Updated page_tree_published in DB")
  } else {
    console.log("No published tree found in DB")
  }
}
main().catch(console.error).finally(() => prisma.$disconnect())
