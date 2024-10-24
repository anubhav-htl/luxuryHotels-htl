import mongoose from "mongoose";

const { Schema, model } = mongoose;

const exclusiveOfferSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, required: true},
  price: { type: Number, required: true},
  status: { type: String, default: 'ongoing' },
  durationMeasure: { type: String, default: 'days' },
  stripe_price_id: { type: String }
}, { timestamps: true });

const ExclusiveOffer = model('ExclusiveOffer', exclusiveOfferSchema);

export default ExclusiveOffer;