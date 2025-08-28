import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { toast } from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true
});

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const fetchRooms = async() => {
    try {
      const {data} = await api.get('/rooms')

      if(data.success){
        setRooms(data.rooms)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // 🔑 Get token
  const getToken = () => localStorage.getItem("token");

  // 🔑 Check if token is valid (optional but recommended)
  const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
      // For JWT tokens, check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      // If not JWT or parsing fails, assume it's valid
      return true;
    }
  };

  const fetchUser = async () => {
    try {
      const token = getToken();
      
      // 🚨 KEY FIX: Don't make request if no token
      if (!token) {
        console.log("No token found, skipping user fetch");
        setIsLoading(false);
        return;
      }

      // Optional: Check token validity
      if (!isTokenValid(token)) {
        console.log("Token expired, clearing storage");
        localStorage.removeItem("token");
        setIsLoading(false);
        return;
      }

      const { data } = await api.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched user:", data);

      if (data.success) {
        setUser({
          id: data._id,
          email: data.email,
          image: data.image,
          role: data.role,
        });

        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentSearchedCities || []);
      } else {
        console.warn("User fetch failed:", data.message);
        toast.error(data.message || "Failed to fetch user");
      }
    } catch (error) {
      console.error("Fetch user failed:", error);
      
      // Handle 401 specifically
      if (error.response?.status === 401) {
        console.log("Unauthorized - clearing token");
        localStorage.removeItem("token");
        setUser(null);
        setIsOwner(false);
      } else {
        toast.error(error.response?.data?.message || error.message || "Failed to fetch user");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 🔑 Function to manually trigger user fetch (call this after login)
  const refetchUser = async () => {
    setIsLoading(true);
    await fetchUser();
  };

  // 🔑 Function to logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsOwner(false);
    setSearchedCities([]);
    navigate("/login"); // or wherever you want to redirect
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, []);

  const value = {
    currency,
    navigate,

    user,
    setUser,

    isOwner,
    setIsOwner,

    api,
    getToken,
    refetchUser, // 🔑 Expose this function
    logout,      // 🔑 Expose logout function
    isLoading,   // 🔑 Expose loading state

    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms,
    setRooms
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);