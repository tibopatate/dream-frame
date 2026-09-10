import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getDraftTree } from '@/lib/page-builder/store'
import { CockpitLayout } from '@/components/cms/CockpitLayout'

export const metadata = {
  title: 'Personnalisation du Site — Dream Frame Admin',
}

export default async function CustomizerPage() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')

  const draftTree = await getDraftTree()

  return <CockpitLayout initialDocument={draftTree} />
}
