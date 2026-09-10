'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export function AdminThemeWrapper({
  children,
}: {
  children: (theme: 'light', toggleTheme: () => void) => React.ReactNode
}) {
  return children('light', () => {})
}
