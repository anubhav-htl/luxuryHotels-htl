import mongoose from "mongoose";

const { Schema, model } = mongoose;

const highlightSchema = new mongoose.Schema({
  //23-10-2024
  // ideal_location: { type: Boolean, default: false },
  // free_airport_transfers: { type: Boolean, default: false },
  // free_parking: { type: Boolean, default: false },
  // varied_breakfast: { type: Boolean, default: false },
  // free_breakfast: { type: Boolean, default: false },
  // high_speed_wifi: { type: Boolean, default: false },
  // concierge_24_7: { type: Boolean, default: false },
  // fitness_center: { type: Boolean, default: false },
  // swimming_pool: { type: Boolean, default: false },
  // spa_services: { type: Boolean, default: false },
  // business_center: { type: Boolean, default: false },
  // pet_friendly: { type: Boolean, default: false },
  // eco_friendly: { type: Boolean, default: false },
  // family_friendly: { type: Boolean, default: false },
  // rooftop_lounge: { type: Boolean, default: false },
  // room_service: { type: Boolean, default: false },
  // laundry_services: { type: Boolean, default: false },
  // accessible_rooms: { type: Boolean, default: false },
  // restaurant_and_bar: { type: Boolean, default: false },
  // event_spaces: { type: Boolean, default: false },
  // hotel_id: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  //23-10-2024
  highlight: {
    type: String,
  },
  Icon: {
    type: String,
  },
});

const Highlight = mongoose.model('Highlight', highlightSchema);

export default Highlight;