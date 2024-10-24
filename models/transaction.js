import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

const transactionSchema = new Schema({
  transactionId: { 
    type: String, 
    required: true, 
    unique: true, 
    default: uuidv4 
  },
  hotelRepId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'HotelRepresentative', 
    required: true 
  },
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  paymentElements: {
    type: Schema.Types.Mixed,
    of: new Schema({
      price: { type: Number},
      details: {
        label: { type: String },
        duration: { type: String },
      }
    }, { _id: false }),
    default: {}
  },
  status: { type: String, default: 'ongoing' },
  cardholder_first_name: { type: String },
  cardholder_last_name: { type: String },
  cardholder_email: { type: String },
  cardholder_country: { type: String },
  cardholder_telephone: { type: String },
  paymentMethod: { type: String },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;