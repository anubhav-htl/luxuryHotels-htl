import Subscription from '../models/subscription.js';
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
        name: name,
      },
    });
    
    console.log('Stripe price created successfully');

    return stripe_pricing.id;
  } catch (error) {
    console.error('Error creating stripe price:', error);
    throw error;
  }
};

export const createSubscription = async (req, res) => {
  try {
    const { name, duration, price, features, billable  } = req.body;
    let new_stripe_price_id = '';
    
    const stripe_pricing = await createNewPrice(name, price);
    new_stripe_price_id = stripe_pricing;

    const newSubscription = new Subscription({
      name,
      duration,
      price,
      billable,
      stripe_price_id: new_stripe_price_id,
      features: Array.isArray(features) ? features : [features]
    });

    await newSubscription.save();
    console.log('Subscription created successfully');

    res.redirect('/admin/subscriptions')
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSubscription = async (req, res) => {
  console.log('This is the request body', req.body);

  try {
    const { name, duration, price, features, billable } = req.body;

    const newStripePriceId = await createNewPrice(name, price);
  
    await Subscription.findByIdAndUpdate(req.params.subscription_id, {
      name,
      duration,
      price,
      billable,
      stripe_price_id: newStripePriceId,
      features: Array.isArray(features) ? features : [features]
    });

    console.log('Subscription updated successfully');

    res.redirect('/admin/subscriptions'); 
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).send('Server error');
  }
};
