import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AnalyticsDashboard } from '@/components/admin/analytics/AnalyticsDashboard'
import { getAggregatedAnalytics } from '@/lib/analytics-store'

export const metadata = { title: 'Dashboard Analytics — Dream Frame Admin' }

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/admin/login')
  }

  const initialData = getAggregatedAnalytics('7d')

  return (
    <div className="min-h-screen bg-slate-50">
      <AnalyticsDashboard initialData={initialData} />
    </div>
  )
}
