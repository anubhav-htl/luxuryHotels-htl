import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CountryVideosSchema = new Schema(
  {
    country_name: {
      type: String,
      default: "",
    },
    video_url: {
      type: String,
      default: "",
    },
    nomination: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Nomination",
    },
    hotel_id: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Hotel",
    },
  },
  {
    timestamps: true,
  }
);

const CountryVideos = model("CountryVideos", CountryVideosSchema);
export default CountryVideos;
