import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

export function isPrismaConfigured(): boolean {
  const url = process.env.DATABASE_URL
  if (!url) return false
  if (url.includes('host:5432') || url.includes('user:password') || url.includes('CHANGE_ME')) {
    return false
  }
  return true
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
