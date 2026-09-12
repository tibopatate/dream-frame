import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getAllReviews, syncDatabaseWithCloud } from '@/lib/data-store'
import { AvisClient } from './avis-client'

export const metadata = {
  title: 'Avis Clients & Témoignages — Dream Frame Admin',
}

export const dynamic = 'force-dynamic'

export default async function AdminAvisPage() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')

  await syncDatabaseWithCloud()
  const reviews = getAllReviews()

  return <AvisClient initialReviews={reviews} />
}
