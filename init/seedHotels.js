import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';


const representativeIds = [
  "66ae6855f48e64bfc04a49cf",
  "66ae6855f48e64bfc04a49d0",
  "66ae6855f48e64bfc04a49d1",
  "66ae6855f48e64bfc04a49d2",
  "66ae6855f48e64bfc04a49d3",
  "66ae6855f48e64bfc04a49d4",
  "66ae6855f48e64bfc04a49d5",
  "66ae6856f48e64bfc04a49d6",
  "66ae6856f48e64bfc04a49d7",
  "66ae6856f48e64bfc04a49d8",
  "66ae6856f48e64bfc04a49d9",
  "66ae6856f48e64bfc04a49da"
];

const shuffledIds = representativeIds.sort(() => 0.5 - Math.random()).slice(0, 10);

const generateHotelData = (repId) => {
  return {
    _id: {
      $oid: new ObjectId().toString()
    },
    hotel_name: faker.company.name(),
    description: faker.lorem.paragraph(),
    location: faker.lorem.lines(1),
    rooms_suites: faker.lorem.paragraph(),
    restaurants_bars: faker.lorem.paragraph() || null,
    spa_wellness: faker.lorem.paragraph() || null,
    other_facilities: faker.lorem.paragraph() || null,
    room_amenities: [
      "Tea and Coffee Machine",
      "Breakfast",
      "WiFi",
      "Towers",
      "Toiletries",
      "Room Service"
    ],
    room_amenities_user: [
      "Amenity X",
      "Amenity Y"
    ],
    hotel_facilities: [
      "Spa",
      "Fitness Center",
      "Restaurant"
    ],
    hotel_facilities_user: [
      "Facility W",
      "Facility Z"
    ],
    youtube: "https://youtu.be/hQ0n9gxAAmc",
    website: "https://example.com",
    map_iframe: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d${faker.number.int({ min: 1000, max: 5000 })}!2d${faker.location.longitude()}!3d${faker.location.latitude()}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd23d63819916ef%3A0x186790d096744c2d!2s${faker.location.city()}!5e0!3m2!1sen!2ske!4v${faker.date.past().getTime()}!5m2!1sen!2ske" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`,
    top_attractions: [
      {
        name: faker.company.name(),
        distance: faker.number.int({ min: 0.1, max: 5 }),
        coordinates: `${faker.location.latitude()}, ${faker.location.longitude()}`,
        _id: {
          $oid: new ObjectId().toString()
          }
      },
      {
        name: faker.company.name(),
        distance: faker.number.int({ min: 0.1, max: 5 }),
        coordinates: `${faker.location.latitude()}, ${faker.location.longitude()}`,
        _id: {
            $oid: new ObjectId().toString()
          }
      },
    ],
    status: "Pending",
    country: {
      $oid: "667eaa4ae827216e33353c94"
    },
    representative: {
      $oid: repId
    },
    images: [
      `https://picsum.photos/960/660?random=${faker.number.int()}`,
      `https://picsum.photos/960/660?random=${faker.number.int()}`,
      `https://picsum.photos/960/660?random=${faker.number.int()}`
    ],
    createdAt: {
      $date: new Date().toISOString()
    },
    updatedAt: {
      $date: new Date().toISOString()
    },
    __v: 0
  }

};

const hotels = Array.from({ length: 12 }, (_, index) => generateHotelData(shuffledIds[index]));

console.log(JSON.stringify(hotels, null, 2));
