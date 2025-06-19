import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // Redirect to signin page if not authenticated
    return <Navigate to="/signin" replace />
  }
  
  return children
}

export default ProtectedRoute