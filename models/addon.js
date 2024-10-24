import mongoose from "mongoose";

const { Schema, model } = mongoose;

const addOnSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  options: [
    {
      label: { type: String, required: true },
      price: { type: Number, required: true },
      duration: { type: Number, required: true }, // Duration in days
      durationMeasure: { type: String, default: 'days' },
      stripe_price_id: { type: String }
    }
  ],
});

const AddOn = mongoose.model('AddOn', addOnSchema);

export default AddOn;