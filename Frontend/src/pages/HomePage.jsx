import { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Header from '../components/Header.jsx'
import Sidebar from '../components/Sidebar.jsx'
import LetterCard from '../components/LetterCard.jsx'
import { FaBars, FaEnvelope, FaPaperPlane, FaGlobe } from 'react-icons/fa'
import '../styles/pages/HomePage.css'
import axios from 'axios'
import { DataContext} from '../context/DataContext.jsx'
import LetterCard2 from '../components/LetterCardRec.jsx'


// Mock data for demo
const DEMO_LETTERS = {
  inbox: [
    {
      id: 'in1',
      subject: 'Welcome to Digital Postbox!',
      content: 'Hello there! We\'re excited to have you join our community. Digital Postbox is a place where you can connect with others through digital letters. Feel free to explore and let us know if you have any questions!',
      sentAt: '2025-02-15T10:30:00Z',
      sender: {
        name: 'Digital Postbox Team',
        handle_name: 'team',
        profile_image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    },
    {
      id: 'in2',
      subject: 'Coffee meetup next week?',
      content: 'Hey! I was wondering if you\'d like to grab coffee next week? I found this new cafe downtown that has amazing pastries. Let me know what day works best for you!',
      sentAt: '2025-02-10T15:45:00Z',
      sender: {
        name: 'Sarah Johnson',
        handle_name: 'sarahj',
        profile_image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    }
  ],
  outbox: [
    {
      id: 'out1',
      subject: 'Re: Project Proposal',
      content: 'Hi Tom, I\'ve reviewed the proposal and it looks great! I have a few minor suggestions: 1. Add more details about the timeline 2. Include cost breakdowns for each phase 3. Add a section about potential risks and mitigation strategies. Let me know what you think!',
      sentAt: '2025-02-05T09:15:00Z',
      sender: {
        name: 'Demo User',
        handle_name: 'demo',
        profile_image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    }
  ],
  public: [
    {
      id: 'pub1',
      subject: 'My Journey Through Southeast Asia',
      content: 'After three months of backpacking through Southeast Asia, I\'ve compiled my favorite moments and photographs. From the bustling streets of Bangkok to the serene rice terraces of Bali, this journey has been transformative. Swipe through to see some of my favorite captures!',
      sentAt: '2025-02-12T14:20:00Z',
      likes: 24,
      comments: 7,
      attachment: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800',
      sender: {
        name: 'Alex Rivera',
        handle_name: 'worldtraveler',
        profile_image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    },
    {
      id: 'pub2',
      subject: 'Thoughts on Minimalism',
      content: 'I\'ve been embracing minimalism for the past year, and it changed my perspective on possessions and happiness. Living with less has given me more mental clarity and freedom. Here are five key lessons I\'ve learned along the way...',
      sentAt: '2025-02-08T11:30:00Z',
      likes: 42,
      comments: 13,
      sender: {
        name: 'Jamie Chen',
        handle_name: 'minimalista',
        profile_image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    },
    {
      id: 'pub3',
      subject: 'Recipe: Homemade Sourdough Bread',
      content: 'After months of perfecting my technique, I\'m finally sharing my fool-proof sourdough recipe! This bread has a crispy crust and soft, airy interior with that perfect tang. The key is in the fermentation process and proper folding technique...',
      sentAt: '2025-02-01T16:45:00Z',
      likes: 86,
      comments: 29,
      attachment: 'https://images.pexels.com/photos/1590080/pexels-photo-1590080.jpeg?auto=compress&cs=tinysrgb&w=800',
      sender: {
        name: 'Marcus Lee',
        handle_name: 'breadmaster',
        prfile_image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    }
  ]
}

function HomePage() {
  const { currentUser } = useAuth()
  const {publicLetters} = useContext(DataContext)
  const {inboxLetters} = useContext(DataContext)
  const {sentLetters} = useContext(DataContext)
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('inbox')
  const [letters, setLetters] = useState([])
 
  console.log("Inbox letters",inboxLetters)
  
  // Get the active tab from URL query parameter or default to inbox
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const tab = searchParams.get('tab')
    if (tab && ['inbox', 'outbox', 'public'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [location.search])
  console.log("tab details:",activeTab)

useEffect(() => {
  const fetchLetters = async () => {
    console.log("Hello")
    if (activeTab === 'public') {
      setLetters(publicLetters)
    } 
    else if(activeTab == 'inbox')
    {
      setLetters(inboxLetters)
    }
    else if(activeTab == 'outbox')
    {
      setLetters(sentLetters)
    }
    else {
      console.log("not public block")
      // For inbox/outbox (demo or real)
      setLetters(DEMO_LETTERS[activeTab] || []);
    }
  };

  fetchLetters();
}, [activeTab]);

  
  // UpsentAt document title
  useEffect(() => {
    document.title = `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} - Digital Postbox`
  }, [activeTab])
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
  
  return (
    <div className="home-page">
      <Header />
      
      <div className="home-container">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="home-main">
          <div className="home-header">
            <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
              <FaBars />
            </button>
            
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'inbox' ? 'active' : ''}`}
                // onClick={() => setActiveTab('inbox')}
                aria-label="Inbox"
              >
                <FaEnvelope className="tab-icon" />
                <span className="tab-text">Inbox</span>
              </button>
              
              <button 
                className={`tab ${activeTab === 'outbox' ? 'active' : ''}`}
                // onClick={() => setActiveTab('outbox')}
                aria-label="Outbox"
              >
                <FaPaperPlane className="tab-icon" />
                <span className="tab-text">Outbox</span>
              </button>
              
              <button 
                className={`tab ${activeTab === 'public' ? 'active' : ''}`}
                // onClick={() => setActiveTab('public')}
                aria-label="Public Feed"
              >
                <FaGlobe className="tab-icon" />
                <span className="tab-text">Public Feed</span>
              </button>
            </div>
            
            <div className="home-user">
              <img 
                src={currentUser?.profile_image} 
                alt={`${currentUser?.name}'s avatar`} 
                className="user-avatar" 
              />
            </div>
          </div>
          
          <div className="letters-container">
            <h1 className="page-title">
              {activeTab === 'inbox' ? 'Your Inbox' : 
               activeTab === 'outbox' ? 'Sent Letters' : 'Public Feed'}
            </h1>
            
            {letters.length > 0 ? (
              <div className="letters-list">
                {activeTab === 'outbox'
    ? letters.map(letter => (
        <LetterCard2
          key={letter.id}
          letter={letter}
          isPublic={activeTab === 'public'}
        />
      ))
    : letters.map(letter => (
        <LetterCard
          key={letter.id}
          letter={letter}
          isPublic={activeTab === 'public'}
        />
      ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  {activeTab === 'inbox' ? <FaEnvelope /> : 
                   activeTab === 'outbox' ? <FaPaperPlane /> : <FaGlobe />}
                </div>
                <h2 className="empty-title">No letters yet</h2>
                <p className="empty-message">
                  {activeTab === 'inbox' 
                    ? "Your inbox is empty. When you receive letters, they'll appear here."
                    : activeTab === 'outbox'
                    ? "You haven't sent any letters yet. Start composing to connect with others!"
                    : "No public posts to show. Follow others or check back later for upsentAts!"}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default HomePage