// const mongoose = require('mongoose');
// const Flight = require('./models/Flight');

// const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Jaipur', 'Ahmedabad', 'Goa'];
// const airlines = ['Air India', 'IndiGo', 'Vistara', 'SpiceJet', 'GoAir', 'AirAsia'];

// async function seedFlights() {
//   try {
//     await mongoose.connect('mongodb://localhost:27017/flight-booking');
    
//     // Clear existing flights
//     await Flight.deleteMany({});
    
//     const flights = [];
    
//     for (let i = 1; i <= 20; i++) {
//       const departureCity = cities[Math.floor(Math.random() * cities.length)];
//       let arrivalCity;
      
//       // Ensure departure and arrival are different
//       do {
//         arrivalCity = cities[Math.floor(Math.random() * cities.length)];
//       } while (arrivalCity === departureCity);
      
//       const basePrice = Math.floor(Math.random() * 1000) + 2000; // ₹2000-3000
//       const departureTime = new Date();
//       departureTime.setDate(departureTime.getDate() + Math.floor(Math.random() * 30));
//       departureTime.setHours(Math.floor(Math.random() * 24), 0, 0, 0);
      
//       const arrivalTime = new Date(departureTime);
//       const flightDuration = Math.floor(Math.random() * 6) + 2; // 2-8 hours
//       arrivalTime.setHours(arrivalTime.getHours() + flightDuration);
      
//       const flight = new Flight({
//         flight_id: `FL${String(i).padStart(3, '0')}`,
//         airline: airlines[Math.floor(Math.random() * airlines.length)],
//         departure_city: departureCity,
//         arrival_city: arrivalCity,
//         departure_time: departureTime,
//         arrival_time: arrivalTime,
//         base_price: basePrice,
//         current_price: basePrice,
//         total_seats: 180,
//         available_seats: Math.floor(Math.random() * 100) + 50
//       });
      
//       flights.push(flight);
//     }
    
//     await Flight.insertMany(flights);
//     console.log(`Seeded ${flights.length} flights successfully!`);
    
//     mongoose.connection.close();
//   } catch (error) {
//     console.error('Error seeding flights:', error);
//     process.exit(1);
//   }
// }

// seedFlights();
const mongoose = require('mongoose');
const Flight = require('./models/Flight');
require('dotenv').config();

const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Jaipur', 'Ahmedabad', 'Goa'];
const airlines = ['Air India', 'IndiGo', 'Vistara', 'SpiceJet', 'GoAir', 'AirAsia'];

async function seedFlights() {
  try {
    console.log('🌍 Connecting to MongoDB Atlas...');
    
    // Use Atlas connection string from .env
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected successfully to MongoDB Atlas');
    
    // Clear existing flights
    const deleteResult = await Flight.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing flights`);
    
    const flights = [];
    const now = new Date();
    
    for (let i = 1; i <= 20; i++) {
      const departureCity = cities[Math.floor(Math.random() * cities.length)];
      let arrivalCity;
      
      // Ensure departure and arrival are different
      do {
        arrivalCity = cities[Math.floor(Math.random() * cities.length)];
      } while (arrivalCity === departureCity);
      
      const basePrice = Math.floor(Math.random() * 1001) + 2000; // ₹2000-3000
      
      // Create departure time in next 30 days
      const departureTime = new Date(now);
      departureTime.setDate(departureTime.getDate() + Math.floor(Math.random() * 30) + 1);
      departureTime.setHours(Math.floor(Math.random() * 24), 0, 0, 0);
      
      const arrivalTime = new Date(departureTime);
      const flightDuration = Math.floor(Math.random() * 6) + 2; // 2-8 hours
      arrivalTime.setHours(arrivalTime.getHours() + flightDuration);
      
      const totalSeats = 180;
      const availableSeats = Math.floor(Math.random() * 101) + 50; // 50-150 seats
      
      const flight = new Flight({
        flight_id: `FL${String(i).padStart(3, '0')}`,
        airline: airlines[Math.floor(Math.random() * airlines.length)],
        departure_city: departureCity,
        arrival_city: arrivalCity,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        base_price: basePrice,
        current_price: basePrice,
        total_seats: totalSeats,
        available_seats: availableSeats,
        booking_attempts: []
      });
      
      flights.push(flight);
    }
    
    const insertedFlights = await Flight.insertMany(flights);
    console.log(`✅ Seeded ${insertedFlights.length} flights successfully!`);
    
    // Display sample of seeded flights
    console.log('\n📊 Sample Flights Created:');
    insertedFlights.slice(0, 3).forEach(flight => {
      console.log(`✈️  ${flight.flight_id}: ${flight.departure_city} → ${flight.arrival_city} | ₹${flight.base_price}`);
    });
    
    mongoose.connection.close();
    console.log('\n🔗 Connection closed. Seeding complete!');
    
  } catch (error) {
    console.error('❌ Error seeding flights:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedFlights();
}

module.exports = seedFlights;