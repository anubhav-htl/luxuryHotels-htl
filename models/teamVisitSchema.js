import mongoose from "mongoose";

const { Schema, model } = mongoose;

const teamVisitSchema = new Schema(
  {
    name: { type: "String" },
    email: { type: "String" },
    representing: { type: "String" },
    hotel_visit: { type: Boolean },
    date_from: { type: String },
    date_to: { type: String },
    sample_magazine: { type: Boolean },
    magazine_type: {
      type: String,
      default: false,
      enum: ["digital", "print", "blank"],
    },
    campaign_option: { type: String },
    leave_message: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const TeamVisit = model("TeamVisit", teamVisitSchema);
export default TeamVisit;
