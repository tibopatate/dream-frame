'use client'

import React from 'react'
import { AnalyticsDashboard } from '@/components/admin/analytics/AnalyticsDashboard'

interface DashboardPanelProps {
  onNavigate?: (category: string) => void
  lastSavedTime?: string | null
}

export function DashboardPanel({ onNavigate, lastSavedTime }: DashboardPanelProps) {
  return <AnalyticsDashboard />
}
