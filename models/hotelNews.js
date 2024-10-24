import mongoose from "mongoose";

const { Schema, model } = mongoose;

const HotelNewsSchema = new Schema(
  {
    business_name: {
      type: String,
      default: "",
    },
    news_type: {
      type: String,
      required: true,
    },
    country: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Country",
    },
    hotel: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Hotel",
    },
    user_name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    news_title: {
      type: String,
      required: true,
    },
    news_description: {
      type: String,
      required: true,
    },
    news_images: {
      type: [String],
      default: "",
    },
    youtube_video_url: {
      type: String,
      default: "",
    },
    paymaent_status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    likes: {
      type: String,
      default: "",
    },
    views: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const HotelNews = model("HotelNews", HotelNewsSchema);
export default HotelNews;
