import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Header from '../components/Header.jsx'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import { FaCamera, FaCheck, FaTimes } from 'react-icons/fa'
import '../styles/pages/Auth.css'

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    handle_name: '',
    password: '',
    confirm_password: '',
    profile_image: null
  })
  
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  })
  
  const fileInputRef = useRef(null)
  const { signup, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home')
    }
  }, [isAuthenticated, navigate])
  
  // Update document title
  useEffect(() => {
    document.title = 'Sign Up - Digital Postbox'
  }, [])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value)
    }
    
    // Check password match
    if (name === 'confirm_password' || (name === 'password' && formData.confirm_password)) {
      if (name === 'password' && value !== formData.confirm_password) {
        setErrors(prev => ({ ...prev, confirm_password: 'Passwords do not match' }))
      } else if (name === 'confirm_password' && value !== formData.password) {
        setErrors(prev => ({ ...prev, confirm_password: 'Passwords do not match' }))
      } else {
        setErrors(prev => ({ ...prev, confirm_password: '' }))
      }
    }
  }
  
  const checkPasswordStrength = (password) => {
    const hasMinLength = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    
    // Calculate score (0-5)
    const criteriaCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial]
      .filter(Boolean).length
    
    setPasswordStrength({
      score: criteriaCount,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecial
    })
  }
  
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate type
  if (!file.type.match('image.*')) {
    setErrors(prev => ({ ...prev, profile_image: 'Please select an image file' }));
    return;
  }

  // Validate size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    setErrors(prev => ({ ...prev, profile_image: 'Image size should be less than 5MB' }));
    return;
  }

  // Store file object only
  setFormData(prev => ({ ...prev, profile_image: file }));
  setErrors(prev => ({ ...prev, profile_image: '' }));

  // Generate preview (for UI only)
  const reader = new FileReader();
  reader.onload = () => {
    setPreviewImage(reader.result);
  };
  reader.readAsDataURL(file);
};
  const triggerFileInput = () => {
    fileInputRef.current.click()
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.handle_name.trim()) {
      newErrors.handle_name = 'Handle name is required'
    } else if (!/^[a-zA-Z0-9_]{3,15}$/.test(formData.handle_name)) {
      newErrors.handle_name = 'Handle must be 3-15 characters and contain only letters, numbers, and underscores'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Password is too weak'
    }
    
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password'
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      const userData = { 
        ...formData,
        profile_image: previewImage || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
      // console.log("user details from frontend to authcontext:",userData)
      await signup(userData)
    } catch (error) {
      setErrors(prev => ({ ...prev, form: error.message || 'Failed to sign up. Please try again.' }))
    } finally {
      setIsLoading(false)
    }
  }
  
  const getStrengthColor = () => {
    const { score } = passwordStrength
    if (score === 0) return 'var(--color-neutral-400)'
    if (score < 3) return 'var(--color-error-500)'
    if (score < 4) return 'var(--color-warning-500)'
    return 'var(--color-success-500)'
  }
  
  return (
    <div className="auth-page">
      <Header />
      
      <main className="auth-container">
        <div className="auth-card sign-up-card">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join Digital Postbox today</p>
          </div>
          
          {errors.form && (
            <div className="auth-error">
              {errors.form}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
           <div className="profile_image-upload">
  <div
    className="profile_image-preview"
    onClick={triggerFileInput}
    style={{
      backgroundImage: previewImage ? `url(${previewImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}
  >
    {!previewImage && <FaCamera className="profile_image-icon" />}
  </div>
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleImageUpload}
    accept="image/*"
    className="hidden-input"
  />
  <p className="profile_image-help">Click to upload profile picture</p>
  {errors.profile_image && <p className="input-error">{errors.profile_image}</p>}
</div>

            
            <div className="form-row">
              <Input
                label="Full Name"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                autoFocus
              />
            </div>
            
            <div className="form-row">
              <Input
                label="Email"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
            </div>
            
            <div className="form-row">
              <Input
                label="Handle"
                type="text"
                id="handle"
                name="handle_name"
                value={formData.handle_name}
                onChange={handleChange}
                error={errors.handle_name}
                required
                placeholder="e.g. john_doe"
                pattern="^[a-zA-Z0-9_]{3,15}$"
                title="Handle must be 3-15 characters and contain only letters, numbers, and underscores"
              />
            </div>
            
            <div className="form-row">
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
              
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-meter">
                    <div 
                      className="strength-progress" 
                      style={{ 
                        width: `${(passwordStrength.score / 5) * 100}%`,
                        backgroundColor: getStrengthColor()
                      }}
                    ></div>
                  </div>
                  
                  <ul className="strength-criteria">
                    <li className={passwordStrength.hasMinLength ? 'met' : ''}>
                      {passwordStrength.hasMinLength ? <FaCheck /> : <FaTimes />}
                      At least 8 characters
                    </li>
                    <li className={passwordStrength.hasUppercase ? 'met' : ''}>
                      {passwordStrength.hasUppercase ? <FaCheck /> : <FaTimes />}
                      Uppercase letter
                    </li>
                    <li className={passwordStrength.hasLowercase ? 'met' : ''}>
                      {passwordStrength.hasLowercase ? <FaCheck /> : <FaTimes />}
                      Lowercase letter
                    </li>
                    <li className={passwordStrength.hasNumber ? 'met' : ''}>
                      {passwordStrength.hasNumber ? <FaCheck /> : <FaTimes />}
                      Number
                    </li>
                    <li className={passwordStrength.hasSpecial ? 'met' : ''}>
                      {passwordStrength.hasSpecial ? <FaCheck /> : <FaTimes />}
                      Special character
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="form-row">
              <Input
                label="Confirm Password"
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                error={errors.confirm_password}
                required
              />
            </div>
            
            <div className="auth-actions">
              <Button 
                type="submit" 
                fullWidth 
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </div>
          </form>
          
          <div className="auth-links">
            <p className="auth-redirect">
              Already have an account?{' '}
              <Link to="/signin" className="auth-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SignUp