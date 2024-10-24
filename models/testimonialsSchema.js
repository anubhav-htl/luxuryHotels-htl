import mongoose from "mongoose";

const { Schema, model } = mongoose;

const testimonialsSchema = new Schema(
  {
    name: {
      type: String,
    },
    hotel_logo: {
      type: String,
    },
    desc: {
      type: String,
    },
    rating: {
      type: Number,
    },
    hotel_id: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Hotel",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const TestimonialsSchema = model("testimonials", testimonialsSchema);
export default TestimonialsSchema;
