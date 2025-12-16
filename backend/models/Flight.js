const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flight_id: {
    type: String,
    required: true,
    unique: true
  },
  airline: {
    type: String,
    required: true,
    enum: ['Air India', 'IndiGo', 'Vistara', 'SpiceJet', 'GoAir', 'AirAsia']
  },
  departure_city: {
    type: String,
    required: true,
    enum: ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Jaipur', 'Ahmedabad', 'Goa']
  },
  arrival_city: {
    type: String,
    required: true,
    enum: ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Jaipur', 'Ahmedabad', 'Goa']
  },
  departure_time: {
    type: Date,
    required: true
  },
  arrival_time: {
    type: Date,
    required: true
  },
  base_price: {
    type: Number,
    required: true,
    min: 2000,
    max: 3000
  },
  current_price: {
    type: Number,
    default: function() { return this.base_price; }
  },
  surge_multiplier: {
    type: Number,
    default: 1.0
  },
  surge_start_time: {
    type: Date,
    default: null
  },
  total_seats: {
    type: Number,
    default: 180
  },
  available_seats: {
    type: Number,
    default: 180
  },
  booking_attempts: [{
    user_id: String,
    attempt_time: Date
  }]
}, {
  timestamps: true
});

// Index for efficient search
flightSchema.index({ departure_city: 1, arrival_city: 1 });

module.exports = mongoose.model('Flight', flightSchema);