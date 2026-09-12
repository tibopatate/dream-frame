import { NextResponse } from 'next/server'
import { getUnifiedProducts } from '@/lib/data-store'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const products = await getUnifiedProducts()
    return NextResponse.json({ products })
  } catch (err: any) {
    return NextResponse.json({ products: MOCK_PRODUCTS }, { status: 500 })
  }
}
