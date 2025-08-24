import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ListRoom = () => {
  const [rooms, settRooms] = useState([]);
  const {api, getToken, user, currency} = useAppContext(); // Changed 'axios' to 'api'

  //fetch rooms for hotel owner
  const fetchRooms = async () => {
    try {
      const {data} = await api.get('/rooms/owner', { // Changed 'axios' to 'api'
        headers: {Authorization: `Bearer ${await getToken()}`}
      })
      if (data.success){
        settRooms(data.rooms)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //toggle availibilty of the room
  const toggleAvailibilty = async(roomId) => {
     const {data} = await api.post('/rooms/toggle-availability',
       {roomId},{ headers: {Authorization: `Bearer ${await getToken()}`} })

       if(data.success){
         toast.success(data.message)
         fetchRooms()
       }else{
         toast.error(data.message)
       }
  }

  useEffect(() => {
    if (user){
       fetchRooms();
    }
  },[user])

  return (
    <div>
      <Title
        font="outfit"
        align="left"
        title="Room Lists"
        subTitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experiencefor users."
      />
      <p className="text-gray-500 mt-8">All Rooms</p>

      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium"> Name</th>

              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                Facility
              </th>

              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Price / night
              </th>

              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {rooms.map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                  {item.roomType}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                  {item.amenities?.join(",")}
                </td>
                <td className="py-3 px-9 text-gray-700 border-t border-gray-300">
                  {currency}{item.pricePerNight}
                </td>
                <td className="py-3 px-4  border-t border-gray-300 text-sm text-red-500 text-center">
                  <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                    <input
                      onChange={() => toggleAvailibilty(item._id)}
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.isAvailable}
                      readOnly
                    />
                    <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                    <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListRoom;