import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminShell } from './admin-shell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/admin/login')
  }

  const userEmail = session.user.email || 'admin@dreamframe.fr'
  const userName = session.user.name || 'Morgan'

  return (
    <AdminShell userName={userName} userEmail={userEmail}>
      {children}
    </AdminShell>
  )
}
