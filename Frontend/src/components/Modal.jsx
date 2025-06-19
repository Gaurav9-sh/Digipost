import { useEffect, useRef } from 'react'
import { FaTimes } from 'react-icons/fa'
import Button from './Button.jsx'
import '../styles/components/Modal.css'

function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium'
}) {
  const modalRef = useRef(null)

  // Close modal when clicking outside or pressing ESC
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
      // Disable scrolling on the body when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className={`modal modal-${size}`} ref={modalRef}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <Button 
            variant="icon" 
            onClick={onClose} 
            className="modal-close" 
            aria-label="Close"
          >
            <FaTimes />
          </Button>
        </div>
        
        <div className="modal-content">
          {children}
        </div>
        
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal