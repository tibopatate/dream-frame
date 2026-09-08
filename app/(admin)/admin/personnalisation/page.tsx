import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getSettings } from '@/lib/data-store'
import { CustomizerClient } from './customizer-client'

export const metadata = {
  title: 'Personnalisation du Site (Style Shopify) — Dream Frame Admin',
}

export default async function CustomizerPage() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')

  const settings = getSettings()

  return <CustomizerClient initialSettings={settings} />
}
