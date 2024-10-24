import mongoose from "mongoose";

const { Schema } = mongoose;

const subscriptionSchema = new Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  duration: { type: Number, required: true },
  features: [{ type: String, required: true }],
  durationMeasure: { type: String, default: 'months' },
  billable: { type: Boolean, default: false }
  // stripe_price_id: { type: String },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;