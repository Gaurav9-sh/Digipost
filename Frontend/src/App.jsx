import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { useTheme } from './context/ThemeContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// Pages
import LandingPage from './pages/LandingPage.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import HomePage from './pages/HomePage.jsx'
import ComposeLetter from './pages/ComposeLetter.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
// import PublicPost from './pages/PublicPost.jsx'
// import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  const { theme } = useTheme()
  const { isAuthenticated } = useAuth()

  return (
    <div className={`app ${theme}`}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected Routes */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/compose" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ComposeLetter />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/:handle" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        {/* <Route 
          path="/post/:id" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PublicPost />
            </ProtectedRoute>
          } 
        /> */}
        {/* <Route 
          path="/settings" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Settings />
            </ProtectedRoute>
          } 
        /> */}
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App