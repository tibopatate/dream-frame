'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export function AdminThemeWrapper({
  children,
  initialTheme = 'light',
}: {
  children: (theme: 'light' | 'dark', toggleTheme: () => void) => React.ReactNode
  initialTheme?: 'light' | 'dark'
}) {
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme)

  useEffect(() => {
    const saved = localStorage.getItem('dreamframe_admin_theme') as 'light' | 'dark' | null
    if (saved) {
      setTheme(saved)
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('dreamframe_admin_theme', next)
  }

  return children(theme, toggleTheme)
}
