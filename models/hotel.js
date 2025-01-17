import mongoose from "mongoose";

const { Schema, model } = mongoose;

const hotelSchema = new Schema(
  {
    hotel_name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String },
    rooms_suites: { type: String },
    about: { type: String },
    restaurants_bars: { type: String },
    spa_wellness: { type: String },
    other_facilities: { type: String },
    additional_information: { type: String },
    room_amenities: [{ type: String }],
    room_amenities_user: [{ type: String }],
    hotel_facilities: [{ type: String }],
	hotel_highlights: [{ type: String }],
    hotel_facilities_user: [{ type: String }],
    transportation:[{ type: String }],
    youtube: { type: String },
    website: { type: String },
    hotel_manager_name: { type: String },
    hotel_manager_email: { type: String },
    hotel_manager_telephone: { type: String },
    country_code_manager: { type: String },
    marketing_manager_name: { type: String },
    marketing_manager_email: { type: String },
    marketing_manager_telephone: { type: String },
    country_code_marketing: { type: String },
    map_iframe: { type: String },
    lat: { type: String },
    long: { type: String },
    map_url: { type: String },
    hotel_likes: { type: String },
    hotel_views: { type: String },
    top_attractions: [
      {
        name: { type: String },
        distance: { type: Number },
        coordinates: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    representative: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HotelRepresentative",
      required: true,
    },
    images: [{ type: String }],
    hotel_logo: { type: String } //23-10-2024
  },
  { timestamps: true }
);

const Hotel = model("Hotel", hotelSchema);

export default Hotel;
