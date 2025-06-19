import { Link } from 'react-router-dom'
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'
import '../styles/components/Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Digital Postbox</h3>
          <p className="footer-description">
            Connect through digital letters. Share your thoughts, stories, and experiences with friends and the world.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Twitter" className="social-link">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Facebook" className="social-link">
              <FaFacebook />
            </a>
            <a href="#" aria-label="Instagram" className="social-link">
              <FaInstagram />
            </a>
            <a href="#" aria-label="LinkedIn" className="social-link">
              <FaLinkedin />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/signin">Sign In</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Help</h4>
          <ul className="footer-links">
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Support</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Legal</h4>
          <ul className="footer-links">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Digital Postbox. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer