import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Header from '../components/Header.jsx'
import Button from '../components/Button.jsx'
import LetterCard from '../components/LetterCard.jsx'
import Modal from '../components/Modal.jsx'
import Input from '../components/Input.jsx'
import { FaEdit, FaUserFriends, FaPaperPlane, FaGlobe } from 'react-icons/fa'
import '../styles/pages/ProfilePage.css'

// Mock data for demo
const DEMO_PROFILE = {
  stats: {
    followers: 245,
    following: 182,
    letters: 67
  },
  bio: "Digital storyteller | Coffee enthusiast | Always learning",
  publicPosts: [
    {
      id: 'pub1',
      subject: 'My Journey Through Southeast Asia',
      content: 'After three months of backpacking through Southeast Asia, I\'ve compiled my favorite moments and photographs. From the bustling streets of Bangkok to the serene rice terraces of Bali, this journey has been transformative.',
      date: '2025-02-12T14:20:00Z',
      likes: 24,
      comments: 7,
      attachment: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: {
        name: 'Demo User',
        handle: 'demo',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    },
    {
      id: 'pub2',
      subject: 'The Art of Letter Writing',
      content: 'In our digital age, there\'s something special about taking the time to compose a thoughtful letter. Here are my thoughts on why this practice remains relevant and meaningful.',
      date: '2025-02-08T11:30:00Z',
      likes: 42,
      comments: 13,
      author: {
        name: 'Demo User',
        handle: 'demo',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    }
  ]
}

function ProfilePage() {
  const { handle } = useParams()
  const { currentUser, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('posts')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: null
  })
  const [errors, setErrors] = useState({})
  console.log("Current user",currentUser);
  // Update document title
  useEffect(() => {
    document.title = `${handle}'s Profile - Digital Postbox`
  }, [handle])
  
  // Fetch profile data
  useEffect(() => {
    // In a real app, this would fetch data from an API
    setProfile({
      ...DEMO_PROFILE,
      name: currentUser?.name || 'Demo User',
      handle: currentUser?.handle || 'demo',
      avatar: currentUser?.profile_image || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio:currentUser?.bio,
      followers:currentUser.followers,
      following:currentUser.following,
      letters:currentUser.lettersCount
    })
  }, [currentUser])
  
  const handleEditProfile = () => {
    setFormData({
      name: currentUser?.name || '',
      bio: profile?.bio || '',
      profile_image: currentUser?.profile_image || null
    })
    setIsEditModalOpen(true)
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, avatar: 'Please select an image file' }))
      return
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, avatar: 'Image size should be less than 5MB' }))
      return
    }
    
    setFormData(prev => ({ ...prev, avatar: file }))
    setErrors(prev => ({ ...prev, avatar: '' }))
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      await updateProfile(formData)
      setIsEditModalOpen(false)
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        form: 'Failed to update profile. Please try again.' 
      }))
    } finally {
      setIsLoading(false)
    }
  }
  
  if (!profile) {
    return (
      <div className="profile-page">
        <Header />
        <main className="profile-container">
          <div className="loading-state">Loading profile...</div>
        </main>
      </div>
    )
  }
  
  return (
    <div className="profile-page">
      <Header />
      
      <main className="profile-container">
        <div className="profile-header">
          <div className="profile-cover">
            <img src={profile.poster?profile.poster:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnTNrW1mJry-nKKtW1-FaHEY30goca1PAcv9xtHpUuTcjS0nUyIB-RKG2ZVzscBYe7q18&usqp=CAU"} alt="" />
          </div>
          
          <div className="profile-info">
            <div className="profile-avatar">
              <img 
                src={profile.avatar} 
                alt={`${profile.name}'s avatar`}
                className="avatar-image"
              />
            </div>
            
            <div className="profile-details">
              <div className="profile-name-section">
                <h1 className="profile-name">{profile.name}</h1>
                <p className="profile-handle">@{profile.handle}</p>
                
                {currentUser?.handle === handle && (
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={handleEditProfile}
                    className="edit-profile-button"
                  >
                    <FaEdit />
                    Edit Profile
                  </Button>
                )}
              </div>
              
              <p className="profile-bio">{profile.bio}</p>
              
              <div className="profile-stats">
                <div className="stat-item">
                  <FaUserFriends className="stat-icon" />
                  <div className="stat-details">
                    <span className="stat-value">{profile.followers}</span>
                    <span className="stat-label">Followers</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <FaUserFriends className="stat-icon" />
                  <div className="stat-details">
                    <span className="stat-value">{profile.following}</span>
                    <span className="stat-label">Following</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <FaPaperPlane className="stat-icon" />
                  <div className="stat-details">
                    <span className="stat-value">{profile.letters}</span>
                    <span className="stat-label">Letters</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-content">
          <div className="profile-tabs">
            <button 
              className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              <FaGlobe />
              Public Posts
            </button>
            
            <button 
              className={`tab ${activeTab === 'letters' ? 'active' : ''}`}
              onClick={() => setActiveTab('letters')}
            >
              <FaPaperPlane />
              Sent Letters
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'posts' ? (
              <div className="posts-grid">
                {profile.publicPosts.map(post => (
                  <LetterCard 
                    key={post.id} 
                    letter={post}
                    isPublic={true}
                  />
                ))}
              </div>
            ) : (
              <div className="letters-grid">
                <div className="empty-state">
                  <FaPaperPlane className="empty-icon" />
                  <h2>No letters to show</h2>
                  <p>Private letters will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        size="medium"
      >
        <form onSubmit={handleSubmit} className="edit-profile-form">
          {errors.form && (
            <div className="form-error">
              {errors.form}
            </div>
          )}
          
          <div className="avatar-upload">
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden-input"
            />
            <label htmlFor="avatar" className="avatar-upload-label">
              <img 
                src={
                  formData.avatar 
                    ? URL.createObjectURL(formData.avatar)
                    : profile.avatar
                }
                alt="Profile avatar"
                className="avatar-preview"
              />
              <div className="avatar-overlay">
                <FaEdit />
                <span>Change Photo</span>
              </div>
            </label>
            {errors.avatar && (
              <p className="input-error">{errors.avatar}</p>
            )}
          </div>
          
          <Input
            label="Name"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            
          />
          
          <div className="input-group">
            <label htmlFor="bio" className="input-label">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="input-field"
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>
          
          <div className="modal-footer">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ProfilePage