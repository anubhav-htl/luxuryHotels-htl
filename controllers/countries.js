import Country from '../models/country.js';

export const createCountry = async (req, res) => {
  try {
    const { country, code } = req.body;

    const result = await Country.create({ country, code });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find().select(["-createdAt","-updatedAt","-__v"]);
    res.status(201).json(countries);
    //res.render('countries/view-countries', { countries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};