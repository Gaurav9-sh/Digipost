import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaHeart, FaComment, FaShare, FaLock, FaGlobe } from 'react-icons/fa'
import '../styles/components/LetterCard.css'

function LetterCard({ letter, isPublic = true }) {
  const [liked, setLiked] = useState(letter.liked || false)
  const [likesCount, setLikesCount] = useState(letter.likes || 0)

 

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isPublic) return

    if (liked) {
      setLikesCount(prev => prev - 1)
    } else {
      setLikesCount(prev => prev + 1)
    }

    setLiked(!liked)
  }

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

 
  const recipient = letter.recipients && letter.recipients.length > 0 ? letter.recipients[0] : {}
  console.log("Recipient details:",recipient)
  return (
    <div className={`letter-card ${isPublic ? 'public' : 'private'}`}>
      <div className="letter-header">
        <Link to={`/profile/${recipient.handle_name || 'unknown'}`} className="author-info">
          <img 
            src={recipient.profile_image || '/default-avatar.png'} 
            alt={`${recipient.name || 'User'}'s avatar`} 
            className="author-avatar" 
          />
          <div className="author-details">
            {/* <h3 className="author-name">{recipient.name || 'Unknown User'}</h3> */}
            <p className="author-handle">@{recipient.handle_name || 'unknown'}</p>
          </div>
        </Link>
        <div className="letter-meta">
          <span className="letter-date">{formatDate(letter.sentAt)}</span>
          <span className="letter-visibility">
            {isPublic ? <FaGlobe title="Public" /> : <FaLock title="Private" />}
          </span>
        </div>
      </div>

      <Link to={isPublic ? `/post/${letter.id}` : `/home?letter=${letter.id}`} className="letter-content-link">
        <h4 className="letter-subject">{letter.subject}</h4>
        <div
          className="letter-content"
          dangerouslySetInnerHTML={{ __html: truncateContent(letter.content) }}
        ></div>

        {letter.attachment && (
          <div className="letter-attachment">
            <img src={letter.attachment} alt="Attachment" className="attachment-preview" />
          </div>
        )}
      </Link>

      {isPublic && (
        <div className="letter-actions">
          <button 
            className={`action-button ${liked ? 'liked' : ''}`} 
            onClick={handleLike}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <FaHeart />
            <span className="action-count">{likesCount}</span>
          </button>

          <Link to={`/post/${letter.id}`} className="action-button">
            <FaComment />
            <span className="action-count">{letter.comments || 0}</span>
          </Link>

          <button className="action-button" aria-label="Share">
            <FaShare />
          </button>
        </div>
      )}
    </div>
  )
}

export default LetterCard
