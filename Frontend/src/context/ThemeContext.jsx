import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  // Check if user has a theme preference in localStorage
  const storedTheme = localStorage.getItem('digitalPostboxTheme')
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

  // Set initial theme based on localStorage or system preference
  const [theme, setTheme] = useState(
    storedTheme || (prefersDarkMode ? 'dark' : 'light')
  )

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('digitalPostboxTheme', theme)
    // Apply theme to body for global styling
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const value = {
    theme,
    toggleTheme
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}