import Hotel from '../models/hotel.js'
import Transaction from '../models/transaction.js';

export async function fetchHotelProfile (req, res, next) {
  if (req.session.passport && req.session.passport.user) {
    const userId = req.session.passport.user.id;

    try {
      const hotelProfile = await Hotel.findOne({ representative: userId }).populate('country');
      if (hotelProfile) {
        req.hotelProfile = hotelProfile;
        res.locals.hotel_identifier = hotelProfile ? hotelProfile._id : null;
      } else {
        req.hotelProfile = null;
        res.locals.hotel_identifier = null;
      }
      
    } catch (error) {
      console.error('Error fetching hotel profile:', error);
      req.hotelProfile = null;
      res.locals.hotel_identifier = null;
    }


    try {
      let totalCount = 0;
      const transaction = await Transaction.findOne({ hotelRepId: userId, status: 'ongoing' });

      if (transaction && transaction.paymentElements) {
        Object.keys(transaction.paymentElements).forEach(key => {
          const items = transaction.paymentElements[key];
          
          if (items && typeof items === 'object') {
            Object.keys(items).forEach(subKey => {
              totalCount += 1;
            });
          }
        });
      }

      res.locals.itemCount = totalCount || null;
    
    } catch (error) {
      console.error('Error updating item count:', error);
    }

  }
  next();
};

export default fetchHotelProfile;