// src/context/DataContext.js
import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

export const DataContext = createContext();


export const DataProvider = ({ children }) => {
  const {currentUser} = useAuth();
  const [sentLetters, setSentLetters] = useState([]);
  const [inboxLetters, setInboxLetters] = useState([]);
  const [publicLetters, setPublicLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users,setUsers] = useState([]);
  // const[recepients,setRecepients] = useState([]);
  
  const fetchLetters = async () => {
    try {
      console.log("Fetch public letter called")
      setLoading(true);
      const [publicRes] = await Promise.all([
        axios.get("http://localhost:5000/api/letters/public-letters"), // replace with actual endpoint
        
      ]);
      
    //   setPrivateLetters(privateRes.data);
      setPublicLetters(publicRes.data);
    } catch (error) {
      console.error("Error fetching letters:", error);
    } finally {
      setLoading(false);
    }
  };
  const getUsers = async () => {
    try{
      const response = await axios.get("http://localhost:5000/api/auth/user-info")
      setUsers(response.data)
    }catch(err)
    {
      console.log(err);
    }
  }

  const getInboxLetters = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/letters/users/${currentUser._id}/inbox`);
    setInboxLetters(response.data.inbox);  // Assuming you're using privateLetters for inbox
  } catch (error) {
    console.error("Failed to fetch inbox letters:", error);
  }
};

const getSentLetters = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/letters/users/${currentUser._id}/sent`);
    setSentLetters(response.data.sent)
  } catch (error) {
    console.error("Failed to fetch sent letters:", error);
  }
};

const fetchUserBasicInfo = async (userIds) => {
  try {
    const response = await axios.post('http://localhost:5000/api/letters/users/bulk-info', {
      userIds,
    });
    console.log(response.data);
    
  } catch (error) {
    console.error('Error fetching user basic info:', error);
    return [];
  }
};

  useEffect(() => {
    fetchLetters();
    getUsers();
    getInboxLetters();
    getSentLetters();
    fetchUserBasicInfo();
  }, []);

  return (
    <DataContext.Provider value={{ publicLetters, users,loading,sentLetters,inboxLetters, refetch: fetchLetters,getUsers,getInboxLetters,getSentLetters,fetchUserBasicInfo }}>
      {children}
    </DataContext.Provider>
  );
};
