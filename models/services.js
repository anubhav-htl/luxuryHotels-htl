import mongoose from "mongoose";

const { Schema, model } = mongoose;

const servicesSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Services = model("services", servicesSchema);
export default Services;
