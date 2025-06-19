import { useRef, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { 
  FaInbox, 
  FaPaperPlane, 
  FaGlobe, 
  FaUser, 
  FaCog, 
  FaPencilAlt,
  FaTimes
} from 'react-icons/fa'
import '../styles/components/Sidebar.css'

function Sidebar({ isOpen, onClose }) {
  const { currentUser } = useAuth()
  const location = useLocation()
  const sidebarRef = useRef(null)

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isOpen) onClose()
  }, [location, isOpen, onClose])

  // Close sidebar when clicking outside of it (mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  return (
    <aside ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="user-info">
          {currentUser?.avatar && (
            <img 
              src={currentUser.avatar} 
              alt={`${currentUser.name}'s avatar`} 
              className="avatar" 
            />
          )}
          <div className="user-details">
            <h3 className="user-name">{currentUser?.name}</h3>
            <p className="user-handle">@{currentUser?.handle}</p>
          </div>
        </div>
        <button className="close-sidebar" onClick={onClose} aria-label="Close sidebar">
          <FaTimes />
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/home?tab=inbox" className="nav-item">
          <FaInbox className="nav-icon" />
          <span>Inbox</span>
        </NavLink>
        <NavLink to="/home?tab=outbox" className="nav-item">
          <FaPaperPlane className="nav-icon" />
          <span>Outbox</span>
        </NavLink>
        <NavLink to="/home?tab=public" className="nav-item">
          <FaGlobe className="nav-icon" />
          <span>Public Feed</span>
        </NavLink>
        <NavLink to={`/profile/${currentUser?.handle}`} className="nav-item">
          <FaUser className="nav-icon" />
          <span>Profile</span>
        </NavLink>
        <NavLink to="/settings" className="nav-item">
          <FaCog className="nav-icon" />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="compose-button-container">
        <NavLink to="/compose" className="compose-button">
          <FaPencilAlt className="compose-icon" />
          <span>Compose Letter</span>
        </NavLink>
      </div>
    </aside>
  )
}

export default Sidebar