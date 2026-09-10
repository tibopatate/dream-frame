'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export function AdminThemeWrapper({
  children,
}: {
  children: (theme: 'dark', toggleTheme: () => void) => React.ReactNode
}) {
  // Forced dark mode to match luxury brand identity and fix editor bugs
  return children('dark', () => {})
}
