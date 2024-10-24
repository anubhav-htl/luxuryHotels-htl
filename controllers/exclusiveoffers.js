import ExclusiveOffer from '../models/exclusiveoffer.js';
import Stripe from 'stripe'
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_API_KEY);

const createNewPrice = async (name, newPrice) => {
  try {
    const stripe_pricing = await stripe.prices.create({
      currency: 'eur',
      unit_amount: newPrice * 100, // converting euros to cents
      product_data: {
        name: `Exclusive Offers - ${name}`,
      },
    });

    console.log('Stripe price created successfully');

    return stripe_pricing.id;
  } catch (error) {
    console.error('Error creating stripe price:', error);
    throw error;
  }
};


export const createExclusiveOffer = async (req, res) => {
  try {
    const { name, description, duration, price } = req.body;
    let new_stripe_price_id = '';

    const stripe_pricing = await createNewPrice(name, price);
    new_stripe_price_id = stripe_pricing;

    await ExclusiveOffer.create({ name, description, duration, price, stripe_price_id: new_stripe_price_id, });

    console.log('Offer created successfully');

    res.redirect('/exclusiveoffers/')
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const editExclusiveOffer = async (req, res) => {
    const { id } = req.params;

    try {
      const { name, description, duration, price } = req.body;

      const newStripePriceId = await createNewPrice(name, price);

      await ExclusiveOffer.findByIdAndUpdate(id, { 
        name, 
        description, 
        duration, 
        stripe_price_id: newStripePriceId,
        price
      });
      
      console.log('Offer updated successfully');

      res.redirect('/exclusiveoffers/');
    } catch (err) {
      console.error(err);
    }
};

export const getAllExclusiveOffers = async (req, res) => {
  try {
    const exclusiveoffers = await ExclusiveOffer.find();
    res.render('exclusiveoffers/viewexclusiveoffers', {  exclusiveoffers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};