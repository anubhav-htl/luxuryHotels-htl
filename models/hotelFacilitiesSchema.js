import mongoose from "mongoose";

const { Schema, model } = mongoose;

const hotelFacilitiesSchema = new Schema(
  {
    facility: {
      type: String,
    },
    Icon: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const HotelFacilitiesSchema = model("hotelfacilities", hotelFacilitiesSchema);

export default HotelFacilitiesSchema;
