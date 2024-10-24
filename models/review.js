import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema({
//23-10-2024
  // reviewer_name: { type: String, required: true },
  // reviewer_email: { type: String, required: true },
  // cleanliness_rating: { type: Number, required: true },
  // facilities_rating: { type: Number, required: true },
  // comfort_rating: { type: Number, required: true },
  // freewifi_rating: { type: Number, required: true },
  // overall_rating: { type: String, required: true },
  // review: { type: String, required: true },
  // hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
//23-10-2024
  reviewer_name: { type: String, required: true },
  reviewer_email: { type: String, required: true },
  cleanliness_rating: { type: Number, required: true },
  country: { type: String, required: true },
  facilities_rating: { type: Number, required: true },
  comfort_rating: { type: Number, required: true },
  freewifi_rating: { type: Number, required: true },
  overall_rating: { type: String, required: true },
  formDate: { type: Date, default: null },
  toDate: {
    type: Date,
    default: null,
  },
  review: { type: String, required: true },
  hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
  reviewer_image: { type: String },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;