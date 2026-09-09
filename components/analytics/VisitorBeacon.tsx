'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function VisitorBeacon() {
  const pathname = usePathname()

  useEffect(() => {
    // Ignore admin pages from public visitor stats
    if (pathname && pathname.startsWith('/admin')) {
      return
    }

    const ping = () => {
      try {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: pathname || '/' }),
        }).catch(() => {})
      } catch {}
    }

    // Immediate ping on navigation
    ping()

    // Periodic heartbeat every 90 seconds
    const interval = setInterval(ping, 90_000)

    return () => clearInterval(interval)
  }, [pathname])

  return null
}
