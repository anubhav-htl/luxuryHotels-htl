import mongoose from "mongoose";
const { Schema, model } = mongoose;

const transportSchema = new mongoose.Schema({
  transportation_category: [
    {
      station_category: { type: String },
      station_name: { type: String },
      time_to_station: { type: Number },
      distance_to_station: { type: Number }    
    }
  ],
  hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
}, { timestamps: true });

const Transport = mongoose.model('Transport', transportSchema);

export default Transport;