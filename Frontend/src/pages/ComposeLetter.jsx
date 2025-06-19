import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Header from '../components/Header.jsx'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { FaPaperPlane, FaImage, FaClock } from 'react-icons/fa'
import '../styles/pages/ComposeLetter.css'

function ComposeLetter() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    attachment: null
  })
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)
  
  // Update document title
  useEffect(() => {
    document.title = 'Compose Letter - Digital Postbox'
  }, [])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, content }))
    
    // Clear error for content when user types
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: '' }))
    }
  }
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // Check file type (images only)
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, attachment: 'Please select an image file' }))
      return
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, attachment: 'Image size should be less than 5MB' }))
      return
    }
    
    setFormData(prev => ({ ...prev, attachment: file }))
    setErrors(prev => ({ ...prev, attachment: '' }))
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Letter content is required'
    }
    
    if (scheduleDate) {
      const selectedDate = new Date(scheduleDate)
      const now = new Date()
      
      if (selectedDate <= now) {
        newErrors.scheduleDate = 'Schedule date must be in the future'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // In a real app, this would make an API call to send the letter
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Redirect to home page after successful send
      navigate('/home')
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        form: 'Failed to send letter. Please try again.' 
      }))
    } finally {
      setIsLoading(false)
    }
  }
  
  const editorModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ]
  }
  
  return (
    <div className="compose-page">
      <Header />
      
      <main className="compose-container">
        <div className="compose-card">
          <div className="compose-header">
            <h1 className="compose-title">Compose Letter</h1>
            <p className="compose-subtitle">Share your thoughts with the world</p>
          </div>
          
          {errors.form && (
            <div className="compose-error">
              {errors.form}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="compose-form">
            <Input
              label="Subject"
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              error={errors.subject}
              required
              autoFocus
            />
            
            <div className="editor-container">
              <label className="editor-label">
                Content
                {errors.content && (
                  <span className="input-error">{errors.content}</span>
                )}
              </label>
              <ReactQuill
                value={formData.content}
                onChange={handleEditorChange}
                modules={editorModules}
                className={errors.content ? 'has-error' : ''}
              />
            </div>
            
            <div className="compose-options">
              <div className="option-group">
                <button
                  type="button"
                  className="attachment-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaImage />
                  <span>Add Image</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden-input"
                />
                {errors.attachment && (
                  <p className="input-error">{errors.attachment}</p>
                )}
                {formData.attachment && (
                  <p className="file-name">{formData.attachment.name}</p>
                )}
              </div>
              
              <div className="option-group">
                <label className="schedule-label">
                  <FaClock />
                  <span>Schedule for later</span>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="schedule-input"
                  />
                </label>
                {errors.scheduleDate && (
                  <p className="input-error">{errors.scheduleDate}</p>
                )}
              </div>
              
              <div className="option-group">
                <label className="visibility-label">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="visibility-checkbox"
                  />
                  <span>Make this letter public</span>
                </label>
              </div>
            </div>
            
            <div className="compose-actions">
              <Button 
                type="submit" 
                fullWidth 
                disabled={isLoading}
              >
                <FaPaperPlane />
                {isLoading ? 'Sending...' : 'Send Letter'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default ComposeLetter