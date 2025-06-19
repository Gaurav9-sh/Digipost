import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Header from '../components/Header.jsx'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import '../styles/pages/Auth.css'

function SignIn() {
  const [formData, setFormData] = useState({
    handleOrEmail: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get the redirect path from location state or default to home
  const from = location.state?.from || '/home'
  
  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])
  
  // Update document title
  useEffect(() => {
    document.title = 'Sign In - Digital Postbox'
  }, [])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Clear login error when user changes input
    if (loginError) {
      setLoginError('')
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.handleOrEmail.trim()) {
      newErrors.handleOrEmail = 'Username or email is required'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setLoginError('')
    
    try {
      await login(formData)
      // Redirect happens automatically via the useEffect
    } catch (error) {
      setLoginError(error.message || 'Failed to sign in. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="auth-page">
      <Header />
      
      <main className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Sign In</h1>
            <p className="auth-subtitle">Welcome back to Digital Postbox</p>
          </div>
          
          {loginError && (
            <div className="auth-error">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Username or Email"
              type="text"
              id="handleOrEmail"
              name="handleOrEmail"
              value={formData.handleOrEmail}
              onChange={handleChange}
              error={errors.handleOrEmail}
              required
              autoFocus
            />
            
            <Input
              label="Password"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            
            <div className="auth-actions">
              <Button 
                type="submit" 
                fullWidth 
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </form>
          
          <div className="auth-links">
            <Link to="/forgot-password" className="auth-link">
              Forgot Password?
            </Link>
            <p className="auth-redirect">
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">
                Sign Up
              </Link>
            </p>
          </div>
          
          {/* For demo purposes, add a hint about credentials */}
          <div className="demo-hint">
            <p><strong>Demo credentials:</strong> username: "demo", password: "password"</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SignIn