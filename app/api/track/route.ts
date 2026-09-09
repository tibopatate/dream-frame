import { NextRequest, NextResponse } from 'next/server'
import { recordVisitorHeartbeat, getRealVisitorStats } from '@/lib/real-visitors'

export async function POST(req: NextRequest) {
  try {
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1'
    const userAgent = req.headers.get('user-agent') || ''
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent)

    let body: { path?: string } = {}
    try {
      body = await req.json()
    } catch {
      // body empty or malformed
    }

    const currentPath = body.path || '/'
    await recordVisitorHeartbeat(ip, isMobile, currentPath)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const stats = await getRealVisitorStats()
    return NextResponse.json(stats)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
