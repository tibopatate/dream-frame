'use client'

/**
 * Client-side helper to trigger real analytics events from any button, modal, or form.
 * Does not block execution and silently posts to /api/track.
 */
export function trackCustomEvent(eventName: string, metadata?: Record<string, any>) {
  if (typeof window === 'undefined') return

  try {
    const sessionId = window.sessionStorage.getItem('df_session_id') || `sess_${Date.now()}`
    const visitorHash = window.localStorage.getItem('df_visitor_id') || `vis_${Date.now()}`

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        visitorHash,
        path: window.location.pathname,
        referrer: document.referrer,
        event: {
          name: eventName,
          metadata,
        },
      }),
    }).catch(() => {})
  } catch {
    // silently catch in non-browser environment
  }
}
