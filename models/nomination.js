import mongoose from "mongoose";

const { Schema } = mongoose;

const nominationSchema = new Schema(
  {
    nomination_type: {
      type: String,
      default: "",
      enum: ["hotel", "traveller"],
    },
    hotelName: { type: String, required: true },
    hotelWebsite: { type: String },
    images: { type: String },
    nominatorName: { type: String, required: true },
    nominatorEmail: { type: String },
    country: { type: String },
    nominationStartDate: { type: Date, default: Date.now() },
    nominationEndDate: {
      type: Date,
      default: function () {
        const endDate = new Date(this.nominationStartDate);
        endDate.setMonth(endDate.getMonth() + 1);
        return endDate;
      }
    },
    paymaent_status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    request_to_visit: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    desc: {
      type: String,
      default: "",
    },
    leave_message: {
      type: String,
      required: true
    },
    youtube_video_url: {
      type: String,
    },
    hotel: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Hotel",
    },
    Subscription: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "HotelSubscription",
    }
  },
  { timestamps: true },
);

nominationSchema.index({ nominationEndDate: 1 });

const Nomination = mongoose.model("Nomination", nominationSchema);

export default Nomination;
