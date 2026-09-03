// Run: node seed.js  -> populates sample rooms, cabs, boats
require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('./models/Room');
const Cab = require('./models/Cab');
const Boat = require('./models/Boat');

const rooms = [
  { name: 'Deluxe Room', type: 'Deluxe', price: 2199, discountPrice: 1799, capacity: 2,
    amenities: ['WiFi','AC','Parking','TV','Geyser'], images: ['/images/room-deluxe.jpg'],
    description: 'Comfortable deluxe room near Ganga Ghats with modern amenities.' },
  { name: 'Super Deluxe Room', type: 'Super Deluxe', price: 2999, discountPrice: 2499, capacity: 3,
    amenities: ['WiFi','AC','Parking','TV','Geyser','Balcony'], images: ['/images/room-superdeluxe.jpg'],
    description: 'Spacious room with balcony view, ideal for families.' },
  { name: 'Kashi Suite', type: 'Suite', price: 4499, discountPrice: 3999, capacity: 4,
    amenities: ['WiFi','AC','Parking','TV','Geyser','Mini Fridge','Room Service'], images: ['/images/room-suite.jpg'],
    description: 'Premium suite with river-facing view and extra living space.' }
];

const cabs = [
  { name: 'Swift Dzire', type: 'Full Day Local Sightseeing', price: 3000, discountPrice: 2500, seats: 4,
    image: '/images/cab-swift.jpg', description: 'Comfortable sedan for local sightseeing.' },
  { name: 'Ertiga', type: 'Full Day Local Sightseeing', price: 3500, discountPrice: 3000, seats: 6,
    image: '/images/cab-ertiga.jpg', description: 'Spacious MUV for small families/groups.' },
  { name: 'Innova Crysta', type: 'Airport Pickup/Drop', price: 2500, discountPrice: 2000, seats: 7,
    image: '/images/cab-innova.jpg', description: 'Premium comfortable ride for airport transfer.' }
];

const boats = [
  { name: 'Sunrise Boat Ride - Assi Ghat', type: 'Motor Boat', price: 999, discountPrice: 799,
    duration: '1 hr', image: '/images/boat-sunrise.jpg', description: 'Morning boat ride to witness sunrise over Ganga.' },
  { name: 'Evening Ganga Aarti Boat', type: 'Motor Boat', price: 1499, discountPrice: 1199,
    duration: '45 min', image: '/images/boat-aarti.jpg', description: 'Private boat for the evening Ganga Aarti view.' },
  { name: 'Luxury Mini Yacht', type: 'Luxury Yacht', price: 5999, discountPrice: 4999,
    duration: '1.5 hr', image: '/images/boat-yacht.jpg', description: 'Luxury yacht ride for special occasions.' }
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kashikunj');
  await Room.deleteMany({});
  await Cab.deleteMany({});
  await Boat.deleteMany({});
  await Room.insertMany(rooms);
  await Cab.insertMany(cabs);
  await Boat.insertMany(boats);
  console.log('Seed data inserted successfully');
  process.exit();
})();
