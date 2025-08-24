import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    hotel: {
        type:String,
        require: true,
        ref: "Hotel"
    },
     roomType: {
        type:String,
        require: true
    },
     pricePerNight: {
        type:String,
        require: true
    },
     amenities: {
        type:Array,
        require: true,
       
    },
     images:[ {
        type:String,
       
    }],
      isAvailable: {
        type:Boolean,
        default: true,
       
    },
    
}, {timestamps:true})


const Room = mongoose.model("Room", roomSchema);
export default Room;