const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingType: { type: String, enum: ['room', 'cab', 'boat'], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId }, // optional — empty for general enquiries
  itemName: String,
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  checkIn: Date,
  checkOut: Date,
  guests: { type: Number, default: 1 },
  message: String,
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
