import { NextResponse } from 'next/server'
import { getSettings, updateSettingsAsync, syncDatabaseWithCloud } from '@/lib/data-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await syncDatabaseWithCloud()
  } catch {}

  const s = getSettings()
  return NextResponse.json({
    cartUpsellsEnabled: s.cartUpsellsEnabled ?? false,
    cartUpsellChevaletEnabled: s.cartUpsellChevaletEnabled ?? false,
    cartUpsellMicrofibreEnabled: s.cartUpsellMicrofibreEnabled ?? false,
    cartUpsellGiftEnabled: s.cartUpsellGiftEnabled ?? false,
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const updated = await updateSettingsAsync({
      cartUpsellsEnabled: Boolean(body.cartUpsellsEnabled),
      cartUpsellChevaletEnabled: Boolean(body.cartUpsellChevaletEnabled),
      cartUpsellMicrofibreEnabled: Boolean(body.cartUpsellMicrofibreEnabled),
      cartUpsellGiftEnabled: Boolean(body.cartUpsellGiftEnabled),
    })

    return NextResponse.json({
      success: true,
      settings: {
        cartUpsellsEnabled: updated.cartUpsellsEnabled,
        cartUpsellChevaletEnabled: updated.cartUpsellChevaletEnabled,
        cartUpsellMicrofibreEnabled: updated.cartUpsellMicrofibreEnabled,
        cartUpsellGiftEnabled: updated.cartUpsellGiftEnabled,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur de sauvegarde' }, { status: 500 })
  }
}
