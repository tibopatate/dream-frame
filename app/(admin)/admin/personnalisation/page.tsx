import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getDraftTree } from '@/lib/page-builder/store'
import { syncDatabaseWithCloud, getAllProducts } from '@/lib/data-store'
import { CockpitLayout } from '@/components/cms/CockpitLayout'

export const metadata = {
  title: 'Personnalisation du Site — Dream Frame Admin',
}

export const dynamic = 'force-dynamic'

export default async function CustomizerPage() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')

  await syncDatabaseWithCloud()
  const [draftTree, products] = await Promise.all([
    getDraftTree(),
    Promise.resolve(getAllProducts().filter((p) => p.isActive)),
  ])

  return <CockpitLayout initialDocument={draftTree} initialProducts={products} />
}
