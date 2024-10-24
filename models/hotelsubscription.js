import mongoose from "mongoose";

const { Schema, models } = mongoose;

const hotelSubscriptionSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
default: null,
    ref: 'Hotel',
    // required: true
  },
  nomination: { type: mongoose.Schema.Types.ObjectId, ref: 'Nomination', required: true },
  purchaseDate: { type: Date, required: true, default: Date.now() },
  endDate: { type: Date, required: true },
  stripe_price_id: { type: String },
  billable: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'active', 'expired'], default: 'pending' },
}, { timestamps: true });

const HotelSubscription = mongoose.model('HotelSubscription', hotelSubscriptionSchema);

export default HotelSubscription;