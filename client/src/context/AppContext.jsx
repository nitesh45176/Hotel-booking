import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { toast } from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // should be http://localhost:5000/api
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

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/user", {
        headers: { Authorization: `Bearer ${getToken()}` },
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
        console.warn("User fetch failed, retrying...");
        setTimeout(() => fetchUser(), 5000);
      }
    } catch (error) {
      console.error("Fetch user failed:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchRooms();
  },[])

  const value = {
    currency,
    navigate,

    user,
    setUser,

    isOwner,
    setIsOwner,

    api,          // expose the axios instance
    getToken,
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
