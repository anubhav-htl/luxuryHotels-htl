import mongoose from "mongoose";

const homeContentSchema = new mongoose.Schema(
  {
    top_banner_video: {
      type: String,
    },
    top_banner_desc: {
      type: String,
    },
    banner_video: {
      type: String,
    },
  },
  { timestamps: true }
);

const HomeContent = mongoose.model("HomeContent", homeContentSchema);

export default HomeContent;
