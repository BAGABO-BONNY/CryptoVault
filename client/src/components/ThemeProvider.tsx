import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  systemTheme: 'dark' | 'light'
  resolvedTheme: 'dark' | 'light'
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  systemTheme: 'light',
  resolvedTheme: 'light',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  
  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )
  
  // Calculate the resolved theme based on current theme setting
  const resolvedTheme = theme === 'system' ? systemTheme : theme

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    
    const themeToApply = theme === 'system' ? systemTheme : theme
    root.classList.add(themeToApply)
    
    // Set data attribute for CSS selectors
    root.setAttribute('data-theme', themeToApply)
    
    // Update body class for compatibility with some components
    if (themeToApply === 'dark') {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        themeToApply === 'dark' ? '#0f172a' : '#ffffff'
      )
    }
  }, [theme, systemTheme])

  const setTheme = (theme: Theme) => {
    localStorage.setItem(storageKey, theme)
    setThemeState(theme)
  }

  const value = {
    theme,
    systemTheme,
    resolvedTheme,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
