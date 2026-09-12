import { NextResponse } from 'next/server'
import { prisma, isPrismaConfigured } from '@/lib/db'
import { getAllProducts, syncDatabaseWithCloud } from '@/lib/data-store'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await syncDatabaseWithCloud()

    let products: any[] = []

    if (isPrismaConfigured()) {
      try {
        const dbProducts = await prisma.product.findMany({
          where: { isActive: true },
          include: { variants: true },
          orderBy: { createdAt: 'desc' },
        })
        if (dbProducts.length > 0) products = dbProducts
      } catch {}
    }

    if (products.length === 0) {
      const stored = getAllProducts().filter((p) => p.isActive)
      if (stored.length > 0) {
        products = stored.map((p) => ({
          ...p,
          variants: [{ id: p.id, stock: p.stock, stockAlert: p.stockAlert, sku: p.sku }],
        }))
      } else {
        products = MOCK_PRODUCTS
      }
    }

    return NextResponse.json({ products })
  } catch (err: any) {
    return NextResponse.json({ products: MOCK_PRODUCTS }, { status: 500 })
  }
}
