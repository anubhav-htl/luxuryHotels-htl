import mongoose from "mongoose";

const { Schema, model } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    hotelYouRepresent: {
      type: String,
    },
    hotel: {
      type: Schema.Types.ObjectId,
      default: null,
      required: false,
      ref: "Hotel",
    },
    message: {
      type: String,
      required: true,
    },
    reqVisit: {
      type: Boolean,
      default: false,
    },
    from_date: {
      type: String,
    },
    to_date: {
      type: String,
    },
    sampleMagazine: {
      type: Boolean,
      default: false,
    },
    magazineType: {
      type: String,
      default: "Digital",
      enum: ["Digital", "Print"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Contact = model("contact", contactSchema);
export default Contact;
