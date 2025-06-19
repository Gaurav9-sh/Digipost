import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa'
import '../styles/components/Header.css'

function Header() {
  const { isAuthenticated, currentUser, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Check if user has scrolled down for header transparency effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-text">Digital Postbox</span>
        </Link>
        
        <div className="mobile-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
        
        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link to="/home\" className="nav-link">Home</Link>
              <Link to="/compose" className="nav-link">Compose</Link>
              <Link to={`/profile/${currentUser?.handle}`} className="nav-link">Profile</Link>
              <Link to="/settings" className="nav-link">Settings</Link>
              <button onClick={handleLogout} className="nav-link btn-primary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/signin" className="nav-link">Sign In</Link>
              <Link to="/signup" className="nav-link btn-primary">Sign Up</Link>
            </>
          )}
          <button 
            className="theme-toggle" 
            onClick={toggleTheme} 
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header