import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AnalyticsDashboard } from '@/components/admin/analytics/AnalyticsDashboard'

export const metadata = { title: 'Dashboard Analytics — Dream Frame Admin' }

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AnalyticsDashboard />
    </div>
  )
}
