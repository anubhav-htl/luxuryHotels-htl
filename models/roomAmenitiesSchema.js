import mongoose from "mongoose";

const { Schema, model } = mongoose;

const roomAmenitiesSchema = new Schema(
  {
    amenity: {
      type: String,
    },
    amenityIcon: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const RoomAmenities = model("roomamenities", roomAmenitiesSchema);

export default RoomAmenities;
