'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function VisitorBeacon() {
  const pathname = usePathname()
  const pageStartRef = useRef<number>(Date.now())

  useEffect(() => {
    // Ignore admin pages from visitor tracking
    if (pathname && pathname.startsWith('/admin')) {
      return
    }

    // 1. Resolve or create persistent anonymized IDs
    let visitorId = ''
    let sessionId = ''
    try {
      visitorId = localStorage.getItem('df_visitor_id') || ''
      if (!visitorId) {
        visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        localStorage.setItem('df_visitor_id', visitorId)
      }

      sessionId = sessionStorage.getItem('df_session_id') || ''
      if (!sessionId) {
        sessionId = `s_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        sessionStorage.setItem('df_session_id', sessionId)
      }
    } catch {
      visitorId = `v_${Date.now()}`
      sessionId = `s_${Date.now()}`
    }

    // 2. Extract UTM parameters from window.location.search (safe for static export)
    let utm: any = undefined
    try {
      if (typeof window !== 'undefined' && window.location.search) {
        const sp = new URLSearchParams(window.location.search)
        utm = {
          source: sp.get('utm_source') || undefined,
          medium: sp.get('utm_medium') || undefined,
          campaign: sp.get('utm_campaign') || undefined,
          term: sp.get('utm_term') || undefined,
          content: sp.get('utm_content') || undefined,
        }
      }
    } catch {
      // ignore
    }

    pageStartRef.current = Date.now()

    const sendBeacon = (isHeartbeat: boolean = false) => {
      try {
        const durationSeconds = Math.round((Date.now() - pageStartRef.current) / 1000)

        const payload = {
          sessionId,
          visitorHash: visitorId,
          path: pathname || '/',
          referrer: document.referrer || '',
          device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
          browser: navigator.userAgent,
          durationSeconds,
          heartbeat: isHeartbeat,
          utm,
        }

        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {})
      } catch {
        // ignore fetch failures
      }
    }

    // Initial pageview ping
    sendBeacon(false)

    // Periodic heartbeat to track real time spent and keep session alive
    const interval = setInterval(() => sendBeacon(true), 30_000)

    // Send final duration upon tab hide/close
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendBeacon(false)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      sendBeacon(false)
    }
  }, [pathname])

  return null
}
