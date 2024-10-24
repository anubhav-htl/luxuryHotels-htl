import mongoose from "mongoose";

const { Schema, model } = mongoose;

const NominateSchema = new Schema(
  {
    nomination_type: {
      type: String,
      default: "",
      enum: ["hotel", "traveller"],
    },
    name: {
      type: String,
    },
    hotel_name: {
      type: String,
    },
    email: {
      type: String,
    },
    country: {
      type:String
    },
    // like_to_visit: {
    //   type: Boolean,
    //   default: false,
    // },
    date_from: {
      type: String,
    },
    date_to: {
      type: String,
    },
    desc: {
      type: String,
      default: "",
    },
    images: {
      type: String,
    },
    youtube_video_url: {
      type: String,
    },
    // add_to_homepage: {
    //   type: Boolean,
    // },
    // homePage_duration: {
    //   type: String,
    //   default: "",
    // },
    leave_message: {
      type: String,
    },
    paymaent_status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    payment_value: {
      type: Number,
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
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Nominate = model("Nominate", NominateSchema);
export default Nominate;
