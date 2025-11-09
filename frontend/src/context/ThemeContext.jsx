// @ts-nocheck
import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }){
  const [dark, setDark] = useState(() => {
    try{
      const val = localStorage.getItem('theme')
      return val ? val === 'dark' : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    }catch(e){ return false }
  })

  useEffect(()=>{
    try{ localStorage.setItem('theme', dark ? 'dark' : 'light') }catch(e){}
    if(dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  },[dark])

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(){ return useContext(ThemeContext) }
