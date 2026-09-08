import { prisma } from '@/lib/db'

export type ConfigurationSelection = {
  dimensionId: string
  finishId: string
  carId: string
  scaleId: string
}

export type PriceBreakdown = {
  basePriceCents: number
  dimensionDeltaCents: number
  finishDeltaCents: number
  carDeltaCents: number
  scaleDeltaCents: number
  rulesDeltaCents: number
  subtotalHtCents: number
  vatRate: number
  vatCents: number
  totalTtcCents: number
  ecoParticipationCents: number
  formattedTtc: string
}

/**
 * Moteur de calcul canonique de prix pour une création sur-mesure Dream Frame.
 * Utilisé universellement par le configurateur, le panier, Stripe et la facturation.
 */
export async function calculateConfigurationPrice(
  selection: ConfigurationSelection
): Promise<PriceBreakdown> {
  const BASE_FRAME_PRICE_CENTS = 12900 // 129.00 € HT de base artisanale
  const VAT_RATE = 20
  const ECO_PARTICIPATION_CENTS = 14 // 0.14 € TTC éco-participation DEEE (LEDs)

  let dimensionDeltaCents = 0
  let finishDeltaCents = 0
  let carDeltaCents = 0
  let scaleDeltaCents = 0
  let rulesDeltaCents = 0

  try {
    // 1. Récupération des deltas d'options en base si connecté
    const p = prisma as any
    const [dimensionOpt, finishOpt, scaleOpt, carModel] = await Promise.all([
      p.configuratorOption?.findUnique({ where: { id: selection.dimensionId } })?.catch(() => null),
      p.configuratorOption?.findUnique({ where: { id: selection.finishId } })?.catch(() => null),
      p.configuratorOption?.findUnique({ where: { id: selection.scaleId } })?.catch(() => null),
      p.carModel?.findUnique({ where: { id: selection.carId } })?.catch(() => null),
    ])

    if (dimensionOpt) dimensionDeltaCents = dimensionOpt.priceDeltaCents
    if (finishOpt) finishDeltaCents = finishOpt.priceDeltaCents
    if (scaleOpt) scaleDeltaCents = scaleOpt.priceDeltaCents

    // Vérification de la liaison voiture-option
    if (carModel) {
      const carOption = await p.configuratorCarOption?.findFirst({
        where: { carId: carModel.id, active: true },
      })?.catch(() => null)
      if (carOption) {
        carDeltaCents = carOption.priceDeltaCents
      }
    }

    // 2. Application des règles de pricing dynamiques (ConfiguratorPricingRule)
    const activeRules = (await p.configuratorPricingRule?.findMany({
      where: { active: true },
      orderBy: { priority: 'asc' },
    })?.catch(() => [])) || []

    for (const rule of activeRules) {
      const matchDim = !rule.dimensionId || rule.dimensionId === selection.dimensionId
      const matchFinish = !rule.finishId || rule.finishId === selection.finishId
      const matchCar = !rule.carId || rule.carId === selection.carId
      const matchScale = !rule.scaleId || rule.scaleId === selection.scaleId

      if (matchDim && matchFinish && matchCar && matchScale) {
        rulesDeltaCents += rule.fixedDeltaCents
      }
    }
  } catch (error) {
    console.warn("Pricing engine fallback calculation (mode hors-ligne ou seed initial):", error)
  }

  const subtotalHtCents =
    BASE_FRAME_PRICE_CENTS +
    dimensionDeltaCents +
    finishDeltaCents +
    carDeltaCents +
    scaleDeltaCents +
    rulesDeltaCents

  const vatCents = Math.round((subtotalHtCents * VAT_RATE) / 100)
  const totalTtcCents = subtotalHtCents + vatCents

  const formattedTtc = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(totalTtcCents / 100)

  return {
    basePriceCents: BASE_FRAME_PRICE_CENTS,
    dimensionDeltaCents,
    finishDeltaCents,
    carDeltaCents,
    scaleDeltaCents,
    rulesDeltaCents,
    subtotalHtCents,
    vatRate: VAT_RATE,
    vatCents,
    totalTtcCents,
    ecoParticipationCents: ECO_PARTICIPATION_CENTS,
    formattedTtc,
  }
}
