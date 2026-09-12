'use client'

import React, { useState, useMemo } from 'react'
import {
  Calculator,
  Coins,
  TrendingUp,
  Package,
  Truck,
  CreditCard,
  Megaphone,
  Percent,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  RotateCcw,
} from 'lucide-react'

interface ProfitCalculatorProps {
  realCA?: number
  realOrdersCount?: number
  isOpen?: boolean
  onToggleOpen?: () => void
}

// Presets by frame format
const PRESETS = {
  a4: {
    name: 'Format Standard A4',
    sellingPrice: 49.90,
    unitsSold: 30,
    frameCost: 7.50,
    carCost: 9.00,
    printCost: 2.50,
    ledCost: 3.50,
    packagingCost: 2.80,
    shippingCost: 6.90,
    freeShipping: true, // Shipping absorbed by store
    adBudgetMonthly: 150,
    taxRegime: 'micro' as const, // 12.3% URSSAF + 1% libératoire = 13.3%
  },
  a3: {
    name: 'Grand Format A3 Collector',
    sellingPrice: 149.90,
    unitsSold: 15,
    frameCost: 18.00,
    carCost: 18.00,
    printCost: 5.50,
    ledCost: 6.00,
    packagingCost: 4.50,
    shippingCost: 9.90,
    freeShipping: true,
    adBudgetMonthly: 200,
    taxRegime: 'micro' as const,
  },
  a2: {
    name: 'Prestige Galerie A2',
    sellingPrice: 249.90,
    unitsSold: 8,
    frameCost: 32.00,
    carCost: 35.00,
    printCost: 11.00,
    ledCost: 9.50,
    packagingCost: 8.00,
    shippingCost: 14.50,
    freeShipping: true,
    adBudgetMonthly: 250,
    taxRegime: 'micro' as const,
  },
}

export function ProfitCalculator({
  realCA = 0,
  realOrdersCount = 0,
  isOpen: externalIsOpen,
  onToggleOpen,
}: ProfitCalculatorProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(true)
  const isExpanded = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const toggleExpanded = onToggleOpen || (() => setInternalIsOpen(!internalIsOpen))

  const [selectedPreset, setSelectedPreset] = useState<'a4' | 'a3' | 'a2' | 'custom'>('a4')

  // State factors
  const [sellingPrice, setSellingPrice] = useState(PRESETS.a4.sellingPrice)
  const [unitsSold, setUnitsSold] = useState(PRESETS.a4.unitsSold)

  // Direct manufacturing costs (COGS per frame)
  const [frameCost, setFrameCost] = useState(PRESETS.a4.frameCost)
  const [carCost, setCarCost] = useState(PRESETS.a4.carCost)
  const [printCost, setPrintCost] = useState(PRESETS.a4.printCost)
  const [ledCost, setLedCost] = useState(PRESETS.a4.ledCost)
  const [packagingCost, setPackagingCost] = useState(PRESETS.a4.packagingCost)

  // Logistics & Transaction costs per frame
  const [shippingCost, setShippingCost] = useState(PRESETS.a4.shippingCost)
  const [freeShipping, setFreeShipping] = useState(true)

  // Marketing & Overheads (Monthly)
  const [adBudget, setAdBudget] = useState(PRESETS.a4.adBudgetMonthly)
  const [fixedCostsMonthly, setFixedCostsMonthly] = useState(30) // e.g. Domain + hosting

  // Tax regime (Micro-Bic vente marchandises: 12.3% + 1% = 13.3% / TVA 20% / None)
  const [taxRate, setTaxRate] = useState(13.3)

  // Apply preset
  const applyPreset = (key: 'a4' | 'a3' | 'a2') => {
    setSelectedPreset(key)
    const p = PRESETS[key]
    setSellingPrice(p.sellingPrice)
    setUnitsSold(p.unitsSold)
    setFrameCost(p.frameCost)
    setCarCost(p.carCost)
    setPrintCost(p.printCost)
    setLedCost(p.ledCost)
    setPackagingCost(p.packagingCost)
    setShippingCost(p.shippingCost)
    setFreeShipping(p.freeShipping)
    setAdBudget(p.adBudgetMonthly)
  }

  // ─── Mathematical Calculations (All factors) ──────────────────────────
  const calculations = useMemo(() => {
    // 1. Total Turnover (Chiffre d'Affaires Brut)
    const totalTurnover = unitsSold * sellingPrice

    // 2. Unit Manufacturing Cost
    const unitManufacturingCost = frameCost + carCost + printCost + ledCost + packagingCost
    const totalManufacturingCost = unitManufacturingCost * unitsSold

    // 3. Unit Transaction Fee (Stripe France: 1.5% + 0.25€)
    const unitStripeFee = sellingPrice * 0.015 + 0.25
    const totalStripeFees = unitStripeFee * unitsSold

    // 4. Shipping costs (if free shipping for client, atelier pays)
    const unitShippingCost = freeShipping ? shippingCost : 0
    const totalShippingCost = unitShippingCost * unitsSold

    // 5. Total Variable Costs
    const totalVariableCosts = totalManufacturingCost + totalStripeFees + totalShippingCost

    // 6. Gross Profit & Gross Margin
    const grossProfit = totalTurnover - totalVariableCosts
    const grossMarginPercent = totalTurnover > 0 ? (grossProfit / totalTurnover) * 100 : 0

    // 7. Taxes & Social Contributions
    const totalTaxes = totalTurnover * (taxRate / 100)

    // 8. Fixed & Marketing Costs
    const totalFixedCosts = adBudget + fixedCostsMonthly

    // 9. NET PROFIT (In pocket!)
    const netProfit = grossProfit - totalTaxes - totalFixedCosts
    const netMarginPercent = totalTurnover > 0 ? (netProfit / totalTurnover) * 100 : 0
    const netProfitPerUnit = unitsSold > 0 ? netProfit / unitsSold : 0

    // 10. Break-even point (Seuil de rentabilité / Point mort)
    // Contribution margin per unit = sellingPrice - unitManufacturingCost - unitStripeFee - unitShippingCost - (sellingPrice * taxRate / 100)
    const unitTax = sellingPrice * (taxRate / 100)
    const unitContributionMargin = sellingPrice - unitManufacturingCost - unitStripeFee - unitShippingCost - unitTax
    const breakEvenUnits = unitContributionMargin > 0 ? Math.ceil(totalFixedCosts / unitContributionMargin) : null
    const breakEvenRevenue = breakEvenUnits ? breakEvenUnits * sellingPrice : null

    // Cost percentages for the visual breakdown bar
    const manufacturingPct = totalTurnover > 0 ? (totalManufacturingCost / totalTurnover) * 100 : 0
    const shippingPct = totalTurnover > 0 ? (totalShippingCost / totalTurnover) * 100 : 0
    const stripePct = totalTurnover > 0 ? (totalStripeFees / totalTurnover) * 100 : 0
    const taxPct = totalTurnover > 0 ? (totalTaxes / totalTurnover) * 100 : 0
    const adPct = totalTurnover > 0 ? (adBudget / totalTurnover) * 100 : 0
    const netPct = Math.max(0, netMarginPercent)

    return {
      totalTurnover,
      unitManufacturingCost,
      totalManufacturingCost,
      unitStripeFee,
      totalStripeFees,
      unitShippingCost,
      totalShippingCost,
      totalVariableCosts,
      grossProfit,
      grossMarginPercent,
      totalTaxes,
      totalFixedCosts,
      netProfit,
      netMarginPercent,
      netProfitPerUnit,
      breakEvenUnits,
      breakEvenRevenue,
      breakdown: {
        manufacturingPct,
        shippingPct,
        stripePct,
        taxPct,
        adPct,
        netPct,
      },
    }
  }, [
    unitsSold,
    sellingPrice,
    frameCost,
    carCost,
    printCost,
    ledCost,
    packagingCost,
    shippingCost,
    freeShipping,
    adBudget,
    fixedCostsMonthly,
    taxRate,
  ])

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden transition-all">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Calculateur Intelligent de Bénéfice &amp; Marge Réelle
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-red-100/70 text-red-700 text-[10px] font-bold">
                Atelier DF
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Simulez et calculez votre marge nette exacte en intégrant fabrication, logistique, Stripe, pub et URSSAF.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Presets */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => applyPreset('a4')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                selectedPreset === 'a4' ? 'bg-white text-red-600 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              A4 (49,90€)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('a3')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                selectedPreset === 'a3' ? 'bg-white text-red-600 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              A3 (149,90€)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('a2')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                selectedPreset === 'a2' ? 'bg-white text-red-600 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              A2 (249,90€)
            </button>
          </div>

          <button
            type="button"
            onClick={toggleExpanded}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            title={isExpanded ? 'Replier le calculateur' : 'Déplier le calculateur'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Sub-bar: Real Boutique CA vs Simulation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 py-2.5 bg-slate-50/80 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  realCA > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span className="text-slate-600 font-medium">
                Chiffre d&apos;Affaires Réel Boutique :
              </span>
              <span className="font-mono font-bold text-slate-900">
                {realCA.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </span>
              <span className="text-slate-400 text-[11px]">
                ({realOrdersCount} commande{realOrdersCount > 1 ? 's' : ''} payée{realOrdersCount > 1 ? 's' : ''})
              </span>
            </div>

            <div className="flex items-center gap-2">
              {realOrdersCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setUnitsSold(realOrdersCount)
                    if (realOrdersCount > 0 && realCA > 0) {
                      setSellingPrice(Number((realCA / realOrdersCount).toFixed(2)))
                    }
                    setSelectedPreset('custom')
                  }}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 text-[11px] font-semibold hover:bg-slate-50 shadow-2xs transition cursor-pointer"
                >
                  Charger mes ventes réelles
                </button>
              )}
              <span className="text-[11px] text-slate-500">
                Modèle de simulation :{' '}
                <strong className="text-red-600 font-semibold">
                  {selectedPreset === 'custom'
                    ? 'Sur-mesure'
                    : PRESETS[selectedPreset]?.name}
                </strong>
              </span>
            </div>
          </div>

          <div className="p-5 space-y-6">
          {/* Top Results Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* 1. CA Estimé */}
            <div className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Chiffre d&apos;Affaires (CA)</span>
                <Coins className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-xl font-extrabold font-mono text-slate-900">
                {calculations.totalTurnover.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </p>
              <span className="text-[10px] text-slate-400">
                {unitsSold} cadre{unitsSold > 1 ? 's' : ''} à {sellingPrice.toFixed(2)} €
              </span>
            </div>

            {/* 2. Coûts de Revient */}
            <div className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Coûts &amp; Charges</span>
                <Package className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-xl font-extrabold font-mono text-rose-600">
                {(
                  calculations.totalVariableCosts +
                  calculations.totalTaxes +
                  calculations.totalFixedCosts
                ).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </p>
              <span className="text-[10px] text-slate-400">
                Matières + Stripe + Expéd. + URSSAF + Pub
              </span>
            </div>

            {/* 3. Marge Brute */}
            <div className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Marge Brute Atelier</span>
                <Percent className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-xl font-extrabold font-mono text-slate-900">
                {calculations.grossMarginPercent.toFixed(1)}%
              </p>
              <span className="text-[10px] text-slate-400">
                {calculations.grossProfit.toFixed(2)} € avant pub &amp; taxes
              </span>
            </div>

            {/* 4. BÉNÉFICE NET RÉEL (Dans la poche) */}
            <div className={`p-3.5 rounded-xl border space-y-1 ${
              calculations.netProfit >= 0
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/70 border-rose-200 text-rose-950'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold">Bénéfice Net Réel</span>
                <Sparkles className={`w-3.5 h-3.5 ${calculations.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`} />
              </div>
              <p className={`text-xl font-extrabold font-mono ${calculations.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {calculations.netProfit.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </p>
              <div className="flex items-center justify-between text-[10px] font-medium">
                <span>{calculations.netMarginPercent.toFixed(1)}% de marge nette</span>
                <span className="font-bold font-mono">
                  {calculations.netProfitPerUnit > 0 ? `+${calculations.netProfitPerUnit.toFixed(2)}€/cadre` : `${calculations.netProfitPerUnit.toFixed(2)}€/cadre`}
                </span>
              </div>
            </div>
          </div>

          {/* Visual Percentage Breakdown Bar */}
          <div className="space-y-1.5 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span>Répartition de 100€ de chiffre d&apos;affaires :</span>
              <span className="text-emerald-600 font-mono">
                {calculations.netMarginPercent > 0 ? `${calculations.netMarginPercent.toFixed(1)}€ dans votre poche` : 'Déficit'}
              </span>
            </div>

            <div className="h-3.5 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="bg-amber-400 h-full"
                style={{ width: `${Math.min(100, calculations.breakdown.manufacturingPct)}%` }}
                title={`Matières premières : ${calculations.breakdown.manufacturingPct.toFixed(1)}%`}
              />
              <div
                className="bg-blue-400 h-full"
                style={{ width: `${Math.min(100, calculations.breakdown.shippingPct)}%` }}
                title={`Livraison : ${calculations.breakdown.shippingPct.toFixed(1)}%`}
              />
              <div
                className="bg-purple-400 h-full"
                style={{ width: `${Math.min(100, calculations.breakdown.stripePct)}%` }}
                title={`Stripe : ${calculations.breakdown.stripePct.toFixed(1)}%`}
              />
              <div
                className="bg-slate-400 h-full"
                style={{ width: `${Math.min(100, calculations.breakdown.taxPct)}%` }}
                title={`Cotisations & Taxes : ${calculations.breakdown.taxPct.toFixed(1)}%`}
              />
              <div
                className="bg-rose-400 h-full"
                style={{ width: `${Math.min(100, calculations.breakdown.adPct)}%` }}
                title={`Publicité : ${calculations.breakdown.adPct.toFixed(1)}%`}
              />
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${Math.max(0, calculations.breakdown.netPct)}%` }}
                title={`Bénéfice Net : ${calculations.breakdown.netPct.toFixed(1)}%`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Matières (
                {calculations.breakdown.manufacturingPct.toFixed(0)}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> Expédition (
                {calculations.breakdown.shippingPct.toFixed(0)}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400" /> Stripe (
                {calculations.breakdown.stripePct.toFixed(0)}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-400" /> Taxes (
                {calculations.breakdown.taxPct.toFixed(0)}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Pub (
                {calculations.breakdown.adPct.toFixed(0)}%)
              </span>
              <span className="flex items-center gap-1 font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Bénéfice Net (
                {calculations.breakdown.netPct.toFixed(0)}%)
              </span>
            </div>
          </div>

          {/* Interactive Factor Sliders & Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Column 1: Ventes & Volume */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-red-600" /> Ventes &amp; Prix
              </h4>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Prix de vente TTC</span>
                  <span className="font-mono font-bold text-slate-900">{sellingPrice.toFixed(2)} €</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={400}
                  step={5}
                  value={sellingPrice}
                  onChange={(e) => {
                    setSellingPrice(Number(e.target.value))
                    setSelectedPreset('custom')
                  }}
                  className="w-full accent-red-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Cadres vendus / mois</span>
                  <span className="font-mono font-bold text-slate-900">{unitsSold} cadres</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={200}
                  step={1}
                  value={unitsSold}
                  onChange={(e) => {
                    setUnitsSold(Number(e.target.value))
                    setSelectedPreset('custom')
                  }}
                  className="w-full accent-red-600"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <span className="text-slate-500 font-medium block">Seuil de rentabilité :</span>
                {calculations.breakEvenUnits !== null ? (
                  <p className="font-bold text-slate-800">
                    <span className="text-red-600 font-mono">{calculations.breakEvenUnits} cadres</span> à vendre
                    pour commencer à faire du bénéfice (soit {calculations.breakEvenRevenue?.toFixed(0)} € de CA).
                  </p>
                ) : (
                  <p className="text-rose-600 font-bold">Prix de vente trop bas pour couvrir les coûts unitaires !</p>
                )}
              </div>
            </div>

            {/* Column 2: Coûts de Fabrication (par cadre) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-red-600" /> Coût de Revient Unitaire
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Cadre bois &amp; vitre :</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={frameCost}
                      onChange={(e) => {
                        setFrameCost(Number(e.target.value))
                        setSelectedPreset('custom')
                      }}
                      className="w-16 p-1 text-right font-mono bg-slate-50 border border-slate-200 rounded text-xs"
                      step={0.5}
                    />
                    <span className="text-slate-400">€</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Miniature supercar :</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={carCost}
                      onChange={(e) => {
                        setCarCost(Number(e.target.value))
                        setSelectedPreset('custom')
                      }}
                      className="w-16 p-1 text-right font-mono bg-slate-50 border border-slate-200 rounded text-xs"
                      step={0.5}
                    />
                    <span className="text-slate-400">€</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Impression beaux-arts :</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={printCost}
                      onChange={(e) => {
                        setPrintCost(Number(e.target.value))
                        setSelectedPreset('custom')
                      }}
                      className="w-16 p-1 text-right font-mono bg-slate-50 border border-slate-200 rounded text-xs"
                      step={0.5}
                    />
                    <span className="text-slate-400">€</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Module LED &amp; câblage :</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={ledCost}
                      onChange={(e) => {
                        setLedCost(Number(e.target.value))
                        setSelectedPreset('custom')
                      }}
                      className="w-16 p-1 text-right font-mono bg-slate-50 border border-slate-200 rounded text-xs"
                      step={0.5}
                    />
                    <span className="text-slate-400">€</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Packaging mousse sécurisé :</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={packagingCost}
                      onChange={(e) => {
                        setPackagingCost(Number(e.target.value))
                        setSelectedPreset('custom')
                      }}
                      className="w-16 p-1 text-right font-mono bg-slate-50 border border-slate-200 rounded text-xs"
                      step={0.5}
                    />
                    <span className="text-slate-400">€</span>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between font-bold">
                  <span className="text-slate-700">Total fabrication / cadre :</span>
                  <span className="font-mono text-slate-900">{calculations.unitManufacturingCost.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* Column 3: Frais Logistiques, Pub & Fiscalité */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-red-600" /> Logistique, Pub &amp; Taxes
              </h4>

              <div className="space-y-2 text-xs">
                {/* Shipping */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Colissimo avec suivi :</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={shippingCost}
                      onChange={(e) => setShippingCost(Number(e.target.value))}
                      className="w-16 p-1 text-right font-mono bg-slate-50 border border-slate-200 rounded text-xs"
                      step={0.5}
                    />
                    <span className="text-slate-400">€</span>
                  </div>
                </div>

                {/* Free shipping toggle */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-600">Livraison offerte au client :</span>
                  <button
                    type="button"
                    onClick={() => setFreeShipping(!freeShipping)}
                    className={`relative w-8 h-4.5 rounded-full transition-colors cursor-pointer ${
                      freeShipping ? 'bg-red-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-xs transition-transform ${
                        freeShipping ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Ads budget */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Budget Pub Ads / mois :</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={adBudget}
                      onChange={(e) => setAdBudget(Number(e.target.value))}
                      className="w-16 p-1 text-right font-mono bg-slate-50 border border-slate-200 rounded text-xs"
                      step={10}
                    />
                    <span className="text-slate-400">€</span>
                  </div>
                </div>

                {/* Tax Regime */}
                <div className="space-y-1 pt-1">
                  <span className="text-slate-600 block">Régime fiscal &amp; social :</span>
                  <select
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800"
                  >
                    <option value={13.3}>Micro-entreprise Vente (12.3% URSSAF + 1% IR = 13.3%)</option>
                    <option value={20.0}>Société SASU / SARL (Estimation charges/TVA 20%)</option>
                    <option value={0}>Aucune charge (Marge brute directe 0%)</option>
                  </select>
                </div>

                {/* Smart Atelier Tip */}
                <div className="p-2.5 bg-red-50/50 border border-red-100 rounded-xl space-y-0.5 mt-2">
                  <span className="text-[10px] font-bold text-red-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Recommandation Atelier :
                  </span>
                  <p className="text-[10px] text-red-600/90 leading-tight">
                    {calculations.netMarginPercent > 35
                      ? 'Excellente rentabilité ! Vous disposez de suffisamment de marge pour investir en publicité Instagram.'
                      : 'Marge sous tension : envisagez d\'augmenter légèrement le prix de vente ou d\'optimiser l\'achat groupé de miniatures.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  )
}
