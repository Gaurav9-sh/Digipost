import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  // Check if user is logged in from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('digitalPostboxUser')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])


const login = async (credentials) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/signin', credentials,{
      withCredentials:true
    });

    const {user } = response.data;

    // Save token and user details in localStorage
    localStorage.setItem('digitalPostboxUser', JSON.stringify(user));
    
    setCurrentUser(user); // Update state/context
    setIsAuthenticated(true);

    return user;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data.message : error.message);
    throw new Error(error.response ? error.response.data.message : 'Login failed');
  }
};

const signup = (userData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Replace 'http://localhost:5000/api/signup' with your actual backend API endpoint
      
      const response = await axios.post('http://localhost:5000/api/auth/signup', userData);

      const user = response.data; // Assuming the backend returns the created user data
      setCurrentUser(user);
      setIsAuthenticated(false);
      navigate('/signin')
      // localStorage.setItem('digitalPostboxUser', JSON.stringify(user));
      resolve(user);
    } catch (error) {
      console.error('Error during signup:', error);
      reject(error);
    }
  });
};
const logout = async () => {
  try {
    
    await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });

    // Clear client-side state
    setCurrentUser(null);
    setIsAuthenticated(false);
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Logout error:', error.response ? error.response.data.message : error.message);
  }
};
  const updateProfile = (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUser = { ...currentUser, ...userData }
        setCurrentUser(updatedUser)
        localStorage.setItem('digitalPostboxUser', JSON.stringify(updatedUser))
        resolve(updatedUser)
      }, 1000)
    })
  }

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    updateProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}