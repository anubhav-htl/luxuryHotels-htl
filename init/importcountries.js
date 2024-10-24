import fs from 'fs';
import csv from 'csv-parser';
import db from '../config/db.js'
import Country from '../models/country.js';
import mongoose from 'mongoose';


const importCountries = () => {
  const countries = [];
  fs.createReadStream('../../../Desktop/countries.csv')
    .pipe(csv())
    .on('data', (row) => {
      countries.push({ 
        country: row.country,
        code: row.code,
      });
    })
    .on('end', async () => {
      try {
        await Country.insertMany(countries);
        console.log('Many countries successfully inserted');
        mongoose.connection.close();
      } catch (error) {
        console.error('Error importing many counties:', error);
      }
    });
};

importCountries();
