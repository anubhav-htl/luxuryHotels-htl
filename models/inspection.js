import mongoose from "mongoose";

const { Schema } = mongoose;

const inspectionSchema = new Schema(
  {
    bookerName: { type: String, required: true },
    country_code: { type: String, required: true },
    telephone: { type: String, required: true },
    from_date_1: { type: Date, required: true },
    to_date_1: { type: Date, required: true },
    from_date_2: { type: Date },
    to_date_2: { type: Date },
    from_date_3: { type: Date },
    to_date_3: { type: Date },
    description: { type: String, required: true },
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    status: {
      type: String,
      enum: ["pending", "active", "expired"],
      default: "pending",
    },
    hotelRepId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HotelRepresentative",
      required: true,
    },
  },
  { timestamps: true },
);

const Inspection = mongoose.model("Inspection", inspectionSchema);

export default Inspection;
