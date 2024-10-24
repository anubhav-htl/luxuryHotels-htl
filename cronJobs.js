import db from './config/db.js';
import cron from 'node-cron'
import HotelAddOn from './models/hoteladdon.js';
import HotelOffer from './models/hoteloffer.js';
import HotelSubscription from './models/hotelsubscription.js';

export async function expireOffers(Model){
  const now = new Date();

  try {
    const result = await Model.updateMany(
      { endDate: { $lt: now }, status: 'active' },
      { $set: { status: 'expired' } }      
    );
    if (result.modifiedCount > 0) {
      console.log(`${result.modifiedCount} expired offer(s) updated successfully`);
    } else {
      console.log('No offers found to update');
    }
  } catch (error) {
    console.error('Error expiring offers:', error);
  }
};


cron.schedule('0 0 * * *', () => {
  console.log(`Running expire offers cron job at ${new Date().toISOString().split('T')[0]} ${getCurrentTime()}`);
  expireOffers(HotelAddOn);
  expireOffers(HotelOffer);
  expireOffers(HotelSubscription);
});

function getCurrentTime() {
  let now = new Date();
  let hours = String(now.getHours()).padStart(2, '0');
  let minutes = String(now.getMinutes()).padStart(2, '0');
  let seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

