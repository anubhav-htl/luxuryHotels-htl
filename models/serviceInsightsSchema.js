import mongoose from "mongoose";

const { Schema, model } = mongoose;

const serviceInsightsSchema = new Schema(
  {
    insights: {
      type: Number,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ServiceInsights = model("serviceInsights", serviceInsightsSchema);
export default ServiceInsights;
