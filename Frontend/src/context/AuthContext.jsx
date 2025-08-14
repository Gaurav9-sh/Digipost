import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import LoadingAnimation from '../components/LoadingAnimation'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();
  
  function base64ToFile(base64String, fileName) {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
}


 useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/verify', {
          withCredentials: true,
        });

        if (response.status === 200) {
          console.log(response)
          setCurrentUser(response.data.user);
          setIsAuthenticated(true);
          console.log("User authenticated:", response.data.user);
        }
        setLoading(false)
      } catch (err) {
        console.error("Authentication failed:", err.response ? err.response.data : err.message);
        setIsAuthenticated(false);
        setLoading(false)
      }
    };

    verifyUser();
  }, []); // Empty dependency array ensures this runs only once after the component mounts

 if (loading) {
    return (
      <LoadingAnimation/>
    );
  }

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

const signup = async (userData) => {
  try {
    const fd = new FormData();
    console.log("User details from signup page:",userData)
    fd.append('name', userData.name);
    fd.append('email', userData.email);
    fd.append('handle_name', userData.handle_name);
    fd.append('password', userData.password);
    fd.append('confirm_password', userData.confirm_password);
  
     let profileFile = userData.profile_image;
   if (typeof profileFile === "string" && profileFile.startsWith("data:image")) {
      profileFile = base64ToFile(profileFile, "profile_image.jpg");
    }

    if (profileFile instanceof File) {
      fd.append('profile_image', profileFile);
    }

    // Debug FormData
    for (let [key, value] of fd.entries()) {
      console.log(key, value);
    }
    
    const response = await axios.post(
      'http://localhost:5000/api/auth/signup',
      fd,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    const user = response.data;
    setCurrentUser(user);
    setIsAuthenticated(false);
    navigate('/signin');

    return user;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
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