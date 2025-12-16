const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flight_id: {
    type: String,
    required: true
  },
  flight_details: {
    airline: String,
    departure_city: String,
    arrival_city: String,
    departure_time: Date,
    arrival_time: Date
  },
  passenger_name: {
    type: String,
    required: true
  },
  passenger_email: {
    type: String,
    required: true
  },
  passenger_phone: {
    type: String,
    required: true
  },
  base_price: {
    type: Number,
    required: true
  },
  final_price: {
    type: Number,
    required: true
  },
  pnr: {
    type: String,
    // required: true,
    unique: true
  },
  booking_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'confirmed'
  },
  ticket_pdf_url: {
    type: String
  }
}, {
  timestamps: true
});

// Generate PNR before saving
bookingSchema.pre('save', async function(next) {
  if (!this.pnr) {
    this.pnr = 'PNR' + Date.now().toString().slice(-8) + 
               Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);