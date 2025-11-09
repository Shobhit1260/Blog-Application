// @ts-nocheck
import React from 'react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle(){
  const { dark, setDark } = useTheme() || { dark: false, setDark: () => {} }

  return (
    <button onClick={()=>setDark(d=>!d)} aria-label="Toggle theme" className="p-2 rounded-md border border-slate-200 dark:border-slate-700">
      {dark ? '🌙' : '☀️'}
    </button>
  )
}
