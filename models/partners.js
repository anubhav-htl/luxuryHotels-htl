import mongoose from "mongoose";

const { Schema, model } = mongoose;

const partnerSchema = new Schema(
  {
    logo: {
      type: String,
    },
    name: {
      type: String,
    },
    website: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Partners = model("partners", partnerSchema);
export default Partners;
