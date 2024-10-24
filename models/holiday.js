import mongoose from "mongoose";

const { Schema } = mongoose;

const holidaySchema = new Schema({
  title: { type: String, required: true },
  images: [{ type: String }],
  dateFrom: { type: Date, required: true },
  dateTo: { type: Date, required: true },
  adult_attendees: { type: Number, required: true },
  children_attendees: { type: Number, required: true },
  competitionclosure: { type: Date, required: true },
  holidaydescription: { type: String, required: true },
  holidayincludes: { type: String, required: true },
  hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  status: { type: String, enum: ['pending', 'active', 'expired'], default: 'pending' },
  hotelRepId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HotelRepresentative',
    required: true
  },
}, { timestamps: true });

const Holiday = mongoose.model('Holiday', holidaySchema);

export default Holiday;