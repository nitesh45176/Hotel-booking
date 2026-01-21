import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/* ===========================
   1️⃣ PUBLIC API (NO TOKEN)
=========================== */
const publicApi = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

/* ===========================
   2️⃣ PRIVATE API (WITH TOKEN)
=========================== */
const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

// Attach token ONLY to private API
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ===========================
     TOKEN HELPERS
  =========================== */
  const getToken = () => localStorage.getItem("token");

  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return true;
    }
  };

  /* ===========================
     FETCH USER
  =========================== */
  const fetchUser = async () => {
    try {
      const token = getToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      if (!isTokenValid(token)) {
        localStorage.removeItem("token");
        setUser(null);
        setIsOwner(false);
        setIsLoading(false);
        return;
      }

      const { data } = await api.get("/user");

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
        toast.error(data.message || "Failed to fetch user");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setUser(null);
        setIsOwner(false);
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refetchUser = async () => {
    setIsLoading(true);
    await fetchUser();
  };

  /* ===========================
     LOGOUT
  =========================== */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsOwner(false);
    setSearchedCities([]);
    navigate("/login");
  };

  /* ===========================
     ROOMS
  =========================== */
  const fetchRooms = async () => {
    try {
      const { data } = await api.get("/rooms");
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, []);

  /* ===========================
     CONTEXT VALUE
  =========================== */
  const value = {
    currency,
    navigate,

    user,
    setUser,
    isOwner,
    setIsOwner,

    api,        
    publicApi,  
    refetchUser,
    logout,
    isLoading,

    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms,
    setRooms,
    getToken
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
