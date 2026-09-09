import crypto from 'crypto'

export interface RealVisitorSession {
  hash: string
  lastSeen: number
  isMobile: boolean
  path: string
}

export interface VisitorStats {
  total: number
  mobileCount: number
  desktopCount: number
  pageCounts: Record<string, number>
}

// In-memory cache for active visitors
const memorySessions = new Map<string, RealVisitorSession>()

// Daily salt regenerated every 24h so IP hash cannot be reversed (GDPR compliance)
let currentSalt = crypto.randomBytes(16).toString('hex')
let lastSaltRotation = Date.now()

function getSalt(): string {
  if (Date.now() - lastSaltRotation > 24 * 60 * 60 * 1000) {
    currentSalt = crypto.randomBytes(16).toString('hex')
    lastSaltRotation = Date.now()
  }
  return currentSalt
}

export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + getSalt()).digest('hex').substring(0, 16)
}

const ACTIVE_WINDOW_MS = 5 * 60 * 1000 // 5 minutes active window
const RATE_LIMIT_MS = 30 * 1000 // 30 seconds between pings for same client

export async function recordVisitorHeartbeat(ip: string, isMobile: boolean, currentPath: string): Promise<boolean> {
  const hash = hashIp(ip)
  const now = Date.now()

  const existing = memorySessions.get(hash)
  if (existing && now - existing.lastSeen < RATE_LIMIT_MS) {
    // Rate limited, ignore duplicate ping
    return false
  }

  memorySessions.set(hash, {
    hash,
    lastSeen: now,
    isMobile,
    path: currentPath || '/',
  })

  // Prune expired sessions
  for (const [key, s] of memorySessions.entries()) {
    if (now - s.lastSeen > ACTIVE_WINDOW_MS) {
      memorySessions.delete(key)
    }
  }

  return true
}

export async function getRealVisitorStats(): Promise<VisitorStats> {
  const now = Date.now()

  // Prune expired sessions
  for (const [key, s] of memorySessions.entries()) {
    if (now - s.lastSeen > ACTIVE_WINDOW_MS) {
      memorySessions.delete(key)
    }
  }

  const list = Array.from(memorySessions.values())
  const total = list.length
  const mobileCount = list.filter((s) => s.isMobile).length
  const desktopCount = total - mobileCount

  const pageCounts: Record<string, number> = {}
  for (const s of list) {
    const p = s.path || '/'
    pageCounts[p] = (pageCounts[p] || 0) + 1
  }

  // Display at least 1 (the current viewing admin session) if active count is 0
  const displayTotal = total > 0 ? total : 1

  return {
    total: displayTotal,
    mobileCount: total > 0 ? mobileCount : 0,
    desktopCount: total > 0 ? desktopCount : 1,
    pageCounts,
  }
}
