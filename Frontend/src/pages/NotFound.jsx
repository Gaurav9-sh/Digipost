import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Header from '../components/Header.jsx'
import Button from '../components/Button.jsx'
import { FaHome, FaSearch, FaSadTear } from 'react-icons/fa'
import '../styles/pages/NotFound.css'

function NotFound() {
  const { isAuthenticated } = useAuth()
  
  // Update document title
  useEffect(() => {
    document.title = 'Page Not Found - Digital Postbox'
  }, [])
  
  return (
    <div className="not-found-page">
      <Header />
      
      <main className="not-found-container">
        <div className="not-found-content">
          <div className="not-found-icon">
            <FaSadTear />
          </div>
          
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Oops! Page Not Found</h2>
          
          <p className="not-found-message">
            The page you're looking for might have been moved, deleted,
            or perhaps never existed in the first place.
          </p>
          
          <div className="not-found-actions">
            <Link to={isAuthenticated ? '/home' : '/'}>
              <Button>
                <FaHome />
                Back to {isAuthenticated ? 'Home' : 'Landing Page'}
              </Button>
            </Link>
            
            <Link to="/search">
              <Button variant="outline">
                <FaSearch />
                Search
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="envelope-animation">
          <div className="lost-envelope">
            <div className="lost-letter"></div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default NotFound