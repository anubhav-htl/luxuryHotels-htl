import mongoose from "mongoose";

const { Schema, models } = mongoose;

const hotelAddOnSchema = new mongoose.Schema({
  hotelRepId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HotelRepresentative',
    required: true
  },
  addOn: { type: mongoose.Schema.Types.ObjectId, ref: 'AddOn', required: true },
  purchaseDate: { type: Date, required: true, default: Date.now() },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'active', 'expired'], default: 'pending' },
}, { timestamps: true });

const HotelAddOn = mongoose.model('HotelAddOn', hotelAddOnSchema);

export default HotelAddOn;