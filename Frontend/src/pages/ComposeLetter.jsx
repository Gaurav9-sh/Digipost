import { useState, useRef,useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Header from '../components/Header.jsx'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { FaPaperPlane, FaImage, FaClock } from 'react-icons/fa'
import '../styles/pages/ComposeLetter.css'
import axios from 'axios'
import { DataContext } from '../context/DataContext.jsx'


function ComposeLetter() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [formData, setFormData] = useState({
    sender:currentUser._id,
    subject: '',
    content: '',
    attachment: '',
  })
  
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)
  const {users} = useContext(DataContext)
  

  useEffect(() => {
    document.title = 'Compose Letter - Digital Postbox'
  }, [])
   const [showModal, setShowModal] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  

  const handleSendClick = () => {
    setShowModal(true);
  };

  const handleConfirmSend = async () => {
    setIsLoading(true);
    setShowModal(false);
    await handleSend({ recipients: isPublic ? 'public' : selectedRecipients });
    setIsLoading(false);
  };

  const toggleRecipient = (id) => {
    setSelectedRecipients((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };
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
  
const handleSend = async ({ recipients }) => {
  if (!validateForm()) return;

  setIsLoading(true);

  try {
    const payload = {
      ...formData,
      recipients, // 'public' OR array of user IDs
    };

    console.log("Sending letter with:", payload);

    const endpoint =
      recipients === 'public'
        ? 'http://localhost:5000/api/letters/public-letters/send'
        : 'http://localhost:5000/api/letters/private-letters/send';

    const response = await axios.post(endpoint, payload);

    console.log("Response from backend", response);

    navigate('/home');
  } catch (error) {
    console.error("Error sending letter:", error);
    setErrors(prev => ({
      ...prev,
      form: 'Failed to send letter. Please try again.'
    }));
  } finally {
    setIsLoading(false);
  }
};

  
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
          
          <form className="compose-form">
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
            
            </div>
            
           <div>
      <div className="compose-actions">
        <button
          type="button"
          className="send-button"
          disabled={isLoading}
          onClick={handleSendClick}
        >
          <FaPaperPlane style={{ marginRight: '8px' }} />
          {isLoading ? 'Sending...' : 'Send Letter'}
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Select Recipients</h2>

            <label>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={() => {
                  setIsPublic(!isPublic);
                  setSelectedRecipients([]); // Clear user selection when public is checked
                }}
              />
              <span>Send to Public</span>
            </label>

            {!isPublic && (
              <div className="user-list">
                {users.map((user) => (
                  <label key={user._id}>
                    <input
                      type="checkbox"
                      checked={selectedRecipients.includes(user._id)}
                      onChange={() => toggleRecipient(user._id)}
                    />
                    <span>{user.handle_name}</span>
                  </label>
                ))}
              </div>
            )}

            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleConfirmSend} disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Confirm Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default ComposeLetter