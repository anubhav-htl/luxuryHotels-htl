import mongoose from 'mongoose';

const { Schema } = mongoose;

const hotelOfferSchema = new Schema({
  hotelRepId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HotelRepresentative',
    required: true
  },
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  exclusiveoffer: { type: mongoose.Schema.Types.ObjectId, ref: 'ExclusiveOffer', required: true },
  countryCode: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  dateFrom: { type: Date, required: true },
  dateTo: { type: Date, required: true },
  purchaseDate: { type: Date, required: true, default: Date.now() },
  endDate: { type: Date, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  redeemLink: { type: String, required: true },
  status: { type: String, enum: ['pending', 'active', 'expired'], default: 'pending' },
}, { timestamps: true });

const HotelOffer = mongoose.model('HotelOffer', hotelOfferSchema);
export default HotelOffer;