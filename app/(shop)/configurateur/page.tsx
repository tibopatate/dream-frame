'use client'

import { useState, useEffect } from 'react'
import { CONFIGURATOR_DATA, ConfigOption } from '@/lib/configurator-data'
import { ThreeTierSelector } from '@/components/configurator/ThreeTierSelector'
import { ConfigurationPreview } from '@/components/configurator/ConfigurationPreview'
import { PriceDisplay } from '@/components/configurator/PriceDisplay'
import { calculateConfigurationPrice, PriceBreakdown } from '@/lib/pricing/calculate'
import { useCart } from '@/lib/store/cart'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'

export default function AtelierConfigurateurPage() {
  const router = useRouter()
  const addItem = useCart((s) => s.addItem)

  // États de sélection des 4 Actes
  const [selectedDimensionId, setSelectedDimensionId] = useState(CONFIGURATOR_DATA.dimensions[1].id) // 30x40 par défaut
  const [selectedFinishId, setSelectedFinishId] = useState(CONFIGURATOR_DATA.finishes[0].id) // Chêne noir par défaut
  const [selectedCarId, setSelectedCarId] = useState(CONFIGURATOR_DATA.cars[0].id) // Ferrari F40 par défaut
  const [selectedScaleId, setSelectedScaleId] = useState(CONFIGURATOR_DATA.scales[1].id) // 1:43 par défaut

  const [price, setPrice] = useState<PriceBreakdown>({
    basePriceCents: 12900,
    dimensionDeltaCents: 2000,
    finishDeltaCents: 0,
    carDeltaCents: 3000,
    scaleDeltaCents: 1500,
    rulesDeltaCents: 0,
    subtotalHtCents: 19400,
    vatRate: 20,
    vatCents: 3880,
    totalTtcCents: 23280,
    ecoParticipationCents: 14,
    formattedTtc: '232,80 €',
  })

  const [isAdding, setIsAdding] = useState(false)
  const [addedNotification, setAddedNotification] = useState(false)

  // Options actives sélectionnées
  const currentDimension =
    CONFIGURATOR_DATA.dimensions.find((d) => d.id === selectedDimensionId) ||
    CONFIGURATOR_DATA.dimensions[0]
  const currentFinish =
    CONFIGURATOR_DATA.finishes.find((f) => f.id === selectedFinishId) ||
    CONFIGURATOR_DATA.finishes[0]
  const currentCar =
    CONFIGURATOR_DATA.cars.find((c) => c.id === selectedCarId) ||
    CONFIGURATOR_DATA.cars[0]
  const currentScale =
    CONFIGURATOR_DATA.scales.find((s) => s.id === selectedScaleId) ||
    CONFIGURATOR_DATA.scales[0]

  // Recalcul du prix canonique serveur dès qu'une option change
  useEffect(() => {
    let isMounted = true

    calculateConfigurationPrice({
      dimensionId: selectedDimensionId,
      finishId: selectedFinishId,
      carId: selectedCarId,
      scaleId: selectedScaleId,
    }).then((breakdown) => {
      if (isMounted) {
        setPrice(breakdown)
      }
    })

    return () => {
      isMounted = false
    }
  }, [selectedDimensionId, selectedFinishId, selectedCarId, selectedScaleId])

  // Ajout au panier avec snapshot de configuration immuable
  const handleAddToCart = () => {
    setIsAdding(true)

    const configurationTitle = `${currentCar.name} · ${currentDimension.subtitle} · ${currentFinish.name} (${currentScale.name})`
    const customVariantId = `custom-${selectedDimensionId}-${selectedFinishId}-${selectedCarId}-${selectedScaleId}`

    addItem({
      variantId: customVariantId,
      productId: currentCar.id,
      productName: configurationTitle,
      slug: 'configurateur',
      brand: currentCar.name.split(' ')[0] || 'Dream Frame',
      image: currentCar.imageUrl || '',
      price: price.totalTtcCents / 100,
      quantity: 1,
      formatName: currentDimension.subtitle,
      formatSize: currentDimension.name,
      options: {
        dimensions: currentDimension.subtitle,
        finish: currentFinish.name,
        car: currentCar.name,
        scale: currentScale.name,
      },
    })

    setIsAdding(false)
    setAddedNotification(true)

    setTimeout(() => {
      router.push('/panier')
    }, 800)
  }

  return (
    <main className="min-h-screen bg-obsidian text-porcelain selection:bg-champagne selection:text-obsidian pt-32 sm:pt-40 pb-24 sm:pb-28">
      {/* Navigation de retour galerie */}
      <div className="max-w-7xl mx-auto px-6 py-4 border-b border-graphite/60 flex items-center justify-between flex-wrap gap-3">
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 text-[10px] font-mono tracking-museum uppercase text-ash hover:text-porcelain transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour au Catalogue
        </Link>
        <div className="flex items-center gap-2 text-[9px] font-mono uppercase text-ash">
          <span className="text-champagne font-bold">01 Voiture</span>
          <span>→</span>
          <span className="text-champagne font-bold">02 Format</span>
          <span>→</span>
          <span className="text-champagne font-bold">03 Échelle</span>
          <span>→</span>
          <span className="text-ash/60">04 Visualisez</span>
          <span>→</span>
          <span className="text-ash/60">05 Achetez</span>
        </div>
      </div>

      {/* Composition 60/40 Desktop */}
      <div className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* 60% : Prévisualisation vivante de la pièce */}
          <div className="lg:col-span-6 xl:col-span-7 sticky top-24">
            <ConfigurationPreview
              dimension={currentDimension}
              finish={currentFinish}
              car={currentCar}
              scale={currentScale}
            />
          </div>

          {/* 40% : Les Actes de création */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-10">
            <div>
              <span className="text-[9px] font-mono tracking-museum uppercase text-champagne">
                Architecture de l&apos;Objet
              </span>
              <h1 className="font-gallery-title text-3xl sm:text-4xl text-porcelain mt-1">
                Composez votre Dream Frame
              </h1>
              <p className="text-xs text-ash tracking-subtle mt-2 leading-relaxed">
                Modifiez la supercar, le format et l&apos;échelle. Le cadre interactif et le tarif se recalculent en temps réel.
              </p>
            </div>

            {/* Sélecteur en 3 Rangées Alignées & Tactiles */}
            <ThreeTierSelector
              dimensions={CONFIGURATOR_DATA.dimensions}
              selectedDimensionId={selectedDimensionId}
              onSelectDimension={setSelectedDimensionId}
              cars={CONFIGURATOR_DATA.cars}
              selectedCarId={selectedCarId}
              onSelectCar={setSelectedCarId}
              scales={CONFIGURATOR_DATA.scales}
              selectedScaleId={selectedScaleId}
              onSelectScale={setSelectedScaleId}
            />

            {/* Affichage du prix et validation */}
            <PriceDisplay
              price={price}
              onAddToCart={handleAddToCart}
              isAdding={isAdding}
            />

            {addedNotification && (
              <div className="p-4 bg-carbon border border-champagne text-porcelain flex items-center gap-3 text-xs font-mono">
                <Check className="w-4 h-4 text-champagne" />
                <span>Pièce enregistrée. Redirection vers votre panier...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── RÉSUMÉ PERSISTANT FLOTTANT (Section 15 du Mega Prompt) ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-t border-neutral-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-[9px] font-mono tracking-widest text-amber-400 uppercase block">
              VOTRE DREAM FRAME
            </span>
            <p className="text-xs font-semibold text-white truncate">
              {currentCar.name} · {currentDimension.subtitle} · {currentScale.name}
            </p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right">
              <span className="text-[9px] text-neutral-400 block font-light">Prix actuel</span>
              <span className="text-base sm:text-lg font-bold text-white">
                {price.formattedTtc}
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className="px-5 py-2.5 bg-white hover:bg-neutral-100 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isAdding ? 'En cours...' : 'Ajouter au Panier'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
