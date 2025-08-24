import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const RoomDetails = () => {
  const { id } = useParams();
  const { api, navigate, getToken, rooms } = useAppContext();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //check if room is available
  const checkAvailability = async () => {
    try {
      setIsLoading(true);
      
      //  check if checkin date is greater than checkout date
      if (new Date(checkInDate) >= new Date(checkOutDate)) {
        toast.error("Check-in date should be less than checkout date");
        return false;
      }
      
      console.log('Checking availability with:', {
        room: id,
        checkInDate,
        checkOutDate
      });
      
      const {data} = await api.post('/bookings/check-availability',
        {room: id , checkInDate, checkOutDate}
      )
   
      if(data.success){
         if(data.isAvailable){
            setIsAvailable(true)
            toast.success("Room is Available")
            return true;
         }else{
            setIsAvailable(false)
            toast.error("Room is not Available")
            return false;
         }
      }else{
         toast.error(data.message || "Failed to check availability")
         return false;
      }
    } catch (error) {
       console.error('Availability check error:', error);
       toast.error(error.response?.data?.message || error.message || "Error checking availability")
       return false;
    } finally {
      setIsLoading(false);
    }
  };

  //onsubmit function to check availability & book the room
  const onSubmitHandler = async(e) => {
    try {
       e.preventDefault();
       setIsLoading(true);
       
       // Validate required fields
       if (!checkInDate || !checkOutDate) {
         toast.error("Please select check-in and check-out dates");
         return;
       }
       
       if (!guests || guests < 1) {
         toast.error("Please select number of guests");
         return;
       }
       
       // Check dates are valid
       if (new Date(checkInDate) >= new Date(checkOutDate)) {
         toast.error("Check-in date should be less than checkout date");
         return;
       }
       
       // If room is not available, just check availability and stop here
       if(!isAvailable){
        const availabilityResult = await checkAvailability();
        return; // Always return after availability check, don't proceed to booking
       }

       // If we reach here, it means isAvailable is true and user clicked "Book Now"
       // Get and validate token first
       const token = await getToken();
       if (!token) {
         toast.error("Please login to book a room");
         return;
       }

       console.log('Proceeding with booking...', {
         room: id,
         checkInDate,
         checkOutDate,
         guests: Number(guests)
       });
      
       const response = await api.post('/bookings/book',
         {
           room: id,
           checkInDate,
           checkOutDate,
           guests: Number(guests),
           paymentMethod: "Pay at hotel"
         },
         { 
           headers: {
             'Authorization': `Bearer ${token}`,
             'Content-Type': 'application/json'
           } 
         }
       )
      
       const { data } = response;
       console.log('Booking response:', data);
      
       if(data.success){
         toast.success(data.message || "Booking successful!")
         navigate('/my-bookings')
         scrollTo(0,0)
       }else{
         console.error('Booking failed:', data);
         toast.error(data.message || "Booking failed")
       }
       
    } catch (error) {
       console.error('Full booking error:', error);
       console.error('Error response:', error.response?.data);
       console.error('Error status:', error.response?.status);
       
       // More specific error handling
       if (error.response?.status === 401) {
         toast.error("Authentication failed. Please login again.");
       } else if (error.response?.status === 400) {
         toast.error(error.response?.data?.message || "Invalid booking data");
       } else if (error.response?.status === 404) {
         toast.error("Room not found");
       } else if (error.response?.status === 500) {
         toast.error("Server error. Please try again later.");
       } else {
         toast.error(error.response?.data?.message || error.message || "Failed to create booking");
       }
    } finally {
      setIsLoading(false);
    }
  }

  // Reset availability when dates change
  useEffect(() => {
    if (isAvailable) {
      setIsAvailable(false);
    }
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    const room = rooms.find((room) => room._id === id);
    room && setRoom(room);
    room && setMainImage(room.images[0]);
  }, [rooms, id]);
  
  return (
    room && (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* Room Details */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-playfair">
            {room.hotel.name}
            <span className="font-inter text-sm">({room.roomType})</span>
          </h1>
          <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
            20% OFF
          </p>
        </div>

        {/* room rating */}
        <div className="flex items-center gap-1 mt-2">
          <StarRating />
          <p>200+ reviews</p>
        </div>

        {/* room address */}
        <div className="flex items-center gap-1 text-gray-500 mt-2">
          <img src={assets.locationIcon} alt="location-icon" />
          <span>{room.hotel.address}</span>
        </div>

        {/* room images */}
        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="lg:w-1/2 w-full">
            <img
              src={mainImage}
              alt="Room Image"
              className="w-full rounded-xl shadow-lg object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full ">
            {room?.images.length > 1 &&
              room.images.map((image, index) => (
                <img
                  key={index}
                  onClick={() => setMainImage(image)}
                  src={image}
                  alt="Room image"
                  className={`w-full rounded-xl shadow-md object-cover cursor-pointer
                    ${mainImage === image ? "outline-3 outline-orange-500" : ""}`}
                />
              ))}
          </div>
        </div>

        {/* room highlights */}
        <div className="flex flex-col md:flex-row md:justify-between mt-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair">
              Experience Luxury Like Never Before
            </h1>
            <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
              {room.amenities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
                >
                  <img
                    src={facilityIcons[item]}
                    alt={item}
                    className="w-5 h-5"
                  />
                  <p className="text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* room price */}
          <p className="text-2xl font-medium">${room.pricePerNight}/night</p>
        </div>

        {/* checkin checkout form */}
        <form onSubmit={onSubmitHandler}
          className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white
      shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl"
        >
          <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
            <div className="flex flex-col">
              <label htmlFor="checkInDate" className="font-medium">
                Check-In
              </label>
              <input
                onChange={(e) => setCheckInDate(e.target.value)}
                value={checkInDate}
                min={new Date().toISOString().split("T")[0]}
                type="date"
                id="checkInDate"
                placeholder="Check-In"
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
            <div className="flex flex-col">
              <label htmlFor="checkOutDate" className="font-medium">
                Check-Out
              </label>
              <input
                onChange={(e) => setCheckOutDate(e.target.value)}
                value={checkOutDate}
                min={checkInDate}
                disabled={!checkInDate || isLoading}
                type="date"
                id="checkOutDate"
                placeholder="Check-Out"
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
            <div className="flex flex-col">
              <label htmlFor="guests" className="font-medium">
                Guests
              </label>
              <input
                onChange={(e) => setGuests(Number(e.target.value))}
                value={guests}
                type="number"
                min="1"
                max="10"
                id="guests"
                placeholder="1"
                className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : (isAvailable ? "Book Now" : "Check Availability")}
          </button>
        </form>

        {/* common specification */}
        <div className="mt-25 space-y-4">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-2">
              <img
                src={spec.icon}
                alt={`${spec.title}-icon`}
                className="w-6.5"
              />
              <div>
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio sed
          distinctio veniam dolorum dolore expedita eius nemo cupiditate, facere
          doloremque. Possimus quisquam exercitationem suscipit tempora at nisi
          reprehenderit, odit commodi consequuntur consectetur magnam nostrum
          aliquam deleniti est! Sapiente natus eveniet harum modi culpa
          obcaecati sint reprehenderit. Deleniti ipsa in quod blanditiis
          maiores, dicta ratione veniam, sequi eius amet nam deserunt!
        </div>

        {/* hosted by */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <img
              src={assets.logo}
              alt="Host"
              className="h-14 w-14  md:h-18 md:w-18 rounded-full text-amber-950"
            />
            <div>
              <p className="text-lg md:text-xl">
                Hosted by {room.hotel?.name}
              </p>
              <div className="flex items-center mt-1">
                <StarRating />
                <p className="ml-2">200+ reviews</p>
              </div>
            </div>
          </div>
          <button className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer">
            Contact now
          </button>
        </div>
      </div>
    )
  );
};

export default RoomDetails;