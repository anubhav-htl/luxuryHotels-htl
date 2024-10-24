import mongoose from "mongoose";

const { Schema, model } = mongoose;

const hotelRepresentativeSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    telephone: { type: String, default: null },
    country_code_hotelrepresentative: { type: String },
    verificationStatus: { type: Boolean, default: false },
    adminApproval: { type: Boolean, default: false },
    verificationToken: { type: String, default: "" },
authToken: { type: String, default: "" }, // // 26-09-2024 changes
  },
  { timestamps: true },
);

const HotelRepresentative = model(
  "HotelRepresentative",
  hotelRepresentativeSchema,
);

export default HotelRepresentative;
