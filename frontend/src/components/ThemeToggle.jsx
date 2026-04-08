// @ts-nocheck
import React from 'react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle(){
  const { dark, setDark } = useTheme() || { dark: false, setDark: () => {} }

  return (
    <button
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle theme"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-teal-500 hover:text-teal-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    >
      <span aria-hidden="true">{dark ? '🌙' : '☀️'}</span>
    </button>
  )
}
