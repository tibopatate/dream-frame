import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getCollaborators } from '@/lib/data-store'
import { CollaborateursClient } from './collaborateurs-client'

export const metadata = {
  title: 'Équipe & Collaborateurs — Dream Frame Admin',
}

export default async function CollaborateursPage() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')

  const collaborators = getCollaborators()

  return <CollaborateursClient initialCollaborators={collaborators} />
}
