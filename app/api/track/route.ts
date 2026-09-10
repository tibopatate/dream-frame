import { NextRequest, NextResponse } from 'next/server'
import { recordVisitorEvent, getAggregatedAnalytics } from '@/lib/analytics-store'

export async function POST(req: NextRequest) {
  try {
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1'

    // Vercel / Cloudflare edge geolocation headers
    const countryCode = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || 'FR'
    const city = req.headers.get('x-vercel-ip-city') ? decodeURIComponent(req.headers.get('x-vercel-ip-city')!) : 'Paris'

    const countryNames: Record<string, string> = {
      FR: 'France',
      CH: 'Suisse',
      BE: 'Belgique',
      CA: 'Canada',
      US: 'États-Unis',
      GB: 'Royaume-Uni',
      DE: 'Allemagne',
      IT: 'Italie',
      ES: 'Espagne',
      MC: 'Monaco',
      LU: 'Luxembourg',
    }
    const country = countryNames[countryCode] || countryCode

    const userAgent = req.headers.get('user-agent') || ''
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent)
    const isTablet = /tablet|ipad/i.test(userAgent)
    const device = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop'

    let body: any = {}
    try {
      body = await req.json()
    } catch {
      // body empty or malformed
    }

    const sessionId = body.sessionId || `s_${Date.now()}`
    const visitorHash = body.visitorHash || `v_${Date.now()}`

    await recordVisitorEvent({
      sessionId,
      visitorHash,
      path: body.path || '/',
      referrer: body.referrer || '',
      device: body.device || device,
      browser: userAgent,
      country,
      countryCode,
      city,
      utm: body.utm,
      event: body.event,
      durationSeconds: body.durationSeconds,
      heartbeat: body.heartbeat,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || '7d'

    const analytics = getAggregatedAnalytics(period)
    return NextResponse.json(analytics)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
