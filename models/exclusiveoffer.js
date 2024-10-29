import mongoose from "mongoose";

const { Schema, model } = mongoose;

const exclusiveOfferSchema = new Schema(
  {
    // name: { type: String, required: true },
    // description: { type: String },
    // duration: { type: Number, required: true},
    // price: { type: Number, required: true},
    // status: { type: String, default: 'ongoing' },
    // durationMeasure: { type: String, default: 'days' },
    // stripe_price_id: { type: String }
    offer_name: { type: String, required: true },
    offer_url: { type: String, required: true },
    offer_description: { type: String, required: true },
    offer_from: { type: String, required: true },
    offer_to: { type: String, required: true },
    offer_image: { type: String, default: "" },
    hotel: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Hotel",
    },
  },
  { timestamps: true }
);

const ExclusiveOffer = model("ExclusiveOffer", exclusiveOfferSchema);

export default ExclusiveOffer;
