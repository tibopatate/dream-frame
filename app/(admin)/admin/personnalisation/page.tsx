import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getDraftTree } from '@/lib/page-builder/store'
import { WebflowEditor } from '@/components/page-builder/WebflowEditor'

export const metadata = {
  title: 'Éditeur In-Page Webflow/Framer — Dream Frame Admin',
}

export default async function CustomizerPage() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')

  const draftTree = await getDraftTree()

  return <WebflowEditor initialDocument={draftTree} />
}
