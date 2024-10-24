import mongoose from "mongoose";

const { Schema, model } = mongoose;

const countrySchema = new Schema({
  country: { type: String, required: true },
 // iso: { type: String },
  code: { type: String },
}, { timestamps: true });

const Country = model('Country', countrySchema);

export default Country;