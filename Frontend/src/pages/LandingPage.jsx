import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import Button from '../components/Button.jsx'
import { 
  FaPaperPlane, 
  FaLock, 
  FaGlobe, 
  FaUserFriends,
  FaArrowRight 
} from 'react-icons/fa'
import '../styles/pages/LandingPage.css'

function LandingPage() {
  const { isAuthenticated } = useAuth()
  const featuresRef = useRef(null)
  
  // Update document title
  useEffect(() => {
    document.title = 'Digital Postbox - Connect Through Digital Letters'
  }, [])

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="landing-page">
      <Header />
      
      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Connect Through Digital Letters</h1>
            <p className="hero-subtitle">
              Share your thoughts, stories, and experiences with friends and the world.
              Digital Postbox brings the charm of letter writing to the digital age.
            </p>
            <div className="hero-actions">
              {isAuthenticated ? (
                <Link to="/home">
                  <Button size="large">
                    Go to Dashboard <FaArrowRight />
                  </Button>
                </Link>
              ) : (
                <Link to="/signup">
                  <Button size="large">
                    Get Started <FaArrowRight />
                  </Button>
                </Link>
              )}
              <button onClick={scrollToFeatures} className="learn-more">
                Learn More
              </button>
            </div>
          </div>
          
          <div className="hero-image">
            <div className="letter-illustration">
              <div className="envelope">
                <div className="letter">
                  <div className="letter-lines">
                    <div className="letter-line"></div>
                    <div className="letter-line"></div>
                    <div className="letter-line"></div>
                    <div className="letter-line"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section ref={featuresRef} className="features-section">
          <h2 className="section-title">What Makes Digital Postbox Special</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaPaperPlane />
              </div>
              <h3 className="feature-title">Digital Letters</h3>
              <p className="feature-description">
                Compose beautiful digital letters with rich formatting, images, and more.
                Add a personal touch to your digital communications.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaLock />
              </div>
              <h3 className="feature-title">Private Messaging</h3>
              <p className="feature-description">
                Send private letters to specific recipients that only they can view.
                Perfect for personal messages and conversations.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaGlobe />
              </div>
              <h3 className="feature-title">Public Sharing</h3>
              <p className="feature-description">
                Share your letters publicly for the world to see, like, and comment on.
                Build a community around your writing.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaUserFriends />
              </div>
              <h3 className="feature-title">Community</h3>
              <p className="feature-description">
                Connect with other writers and readers who share your interests.
                Discover new perspectives and stories.
              </p>
            </div>
          </div>
        </section>
        
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Writing?</h2>
            <p className="cta-description">
              Join thousands of users already sharing their stories and connecting
              through Digital Postbox. Sign up today and start writing!
            </p>
            {!isAuthenticated && (
              <div className="cta-actions">
                <Link to="/signup">
                  <Button size="large">Create Account</Button>
                </Link>
                <Link to="/signin">
                  <Button variant="outline" size="large">Sign In</Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default LandingPage