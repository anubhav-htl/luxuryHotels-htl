import AddOn from '../models/addon.js';
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

export const createAddOn = async (req, res) => {
  try {
    const { name, description, options } = req.body;

    const optionsWithStripeIds = await Promise.all(options.map(async (option) => {
      const stripe_price_id = await createNewPrice(`${name} - ${option.label}`, option.price);
      return {
        label: option.label,
        duration: parseInt(option.duration),
        durationMeasure: option.durationMeasure,
        price: parseInt(option.price),
        stripe_price_id: stripe_price_id,
      };
    }));

    const newAddOn = new AddOn({
      name, 
      description, 
      options: optionsWithStripeIds,
    });

    await newAddOn.save();
    console.log('Saved new addon successfully');
    res.redirect('/addons/')
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editAddOn = async (req, res) => {
  try {
    const { name, description, options, addon_id } = req.body;

    const optionsWithStripeIds = await Promise.all(options.map(async (option) => {
      const stripe_price_id = await createNewPrice(`${name} - ${option.label}`, option.price);
      return {
        label: option.label,
        duration: parseInt(option.duration),
        durationMeasure: option.durationMeasure,
        price: parseInt(option.price),
        stripe_price_id: stripe_price_id,
      };
    }));

    await AddOn.findByIdAndUpdate(addon_id, { 
      name,
      description,
      options: optionsWithStripeIds,
    });
    
    console.log('Successfully updated addon');

    res.redirect('/addons/')
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllAddOns = async (req, res) => {
  try {
    const addons = await AddOn.find();
    res.render('addons/view-addons', { addons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};