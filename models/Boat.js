const mongoose = require('mongoose');

const boatSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Dashashwamedh Ghat Ride, Sunrise Boat
  type: { type: String, required: true }, // Motor Boat, Luxury Yacht, Bajra
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  duration: String, // 1 hr, 45 min
  image: String,
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Boat', boatSchema);
