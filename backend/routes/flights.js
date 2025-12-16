const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');
const dynamicPricing = require('../utils/dynamicPricing');

// Get all flights with search
router.get('/search', async (req, res) => {
  try {
    const { departure_city, arrival_city, sort = 'departure_time', minPrice, maxPrice } = req.query;
    
    let query = {};
    
    if (departure_city) {
      query.departure_city = departure_city;
    }
    
    if (arrival_city) {
      query.arrival_city = arrival_city;
    }
    
    if (minPrice || maxPrice) {
      query.current_price = {};
      if (minPrice) query.current_price.$gte = parseInt(minPrice);
      if (maxPrice) query.current_price.$lte = parseInt(maxPrice);
    }

    // Apply dynamic pricing to all flights
    const flights = await Flight.find(query).limit(10);
    
    const updatedFlights = await Promise.all(flights.map(async (flight) => {
      const surgeData = dynamicPricing.calculateSurge(flight);
      
      // Update flight if surge changed
      if (flight.current_price !== surgeData.current_price || 
          flight.surge_multiplier !== surgeData.surge_multiplier) {
        flight.current_price = surgeData.current_price;
        flight.surge_multiplier = surgeData.surge_multiplier;
        flight.surge_start_time = surgeData.surge_start_time;
        await flight.save();
      }
      
      return flight;
    }));

    // Sorting
    let sortedFlights = [...updatedFlights];
    if (sort === 'price_asc') {
      sortedFlights.sort((a, b) => a.current_price - b.current_price);
    } else if (sort === 'price_desc') {
      sortedFlights.sort((a, b) => b.current_price - a.current_price);
    } else if (sort === 'departure_time') {
      sortedFlights.sort((a, b) => a.departure_time - b.departure_time);
    }

    res.json(sortedFlights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get flight by ID
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findOne({ flight_id: req.params.id });
    
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    const surgeData = dynamicPricing.calculateSurge(flight);
    
    if (flight.current_price !== surgeData.current_price) {
      flight.current_price = surgeData.current_price;
      flight.surge_multiplier = surgeData.surge_multiplier;
      flight.surge_start_time = surgeData.surge_start_time;
      await flight.save();
    }

    res.json(flight);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Record booking attempt
router.post('/:id/attempt', async (req, res) => {
  try {
    const { userId } = req.body;
    const flight = await Flight.findOne({ flight_id: req.params.id });
    
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    // Add booking attempt
    dynamicPricing.addBookingAttempt(flight, userId);
    
    // Calculate new price
    const surgeData = dynamicPricing.calculateSurge(flight);
    
    // Update flight
    flight.current_price = surgeData.current_price;
    flight.surge_multiplier = surgeData.surge_multiplier;
    flight.surge_start_time = surgeData.surge_start_time;
    await flight.save();

    res.json({
      current_price: flight.current_price,
      surge_multiplier: flight.surge_multiplier,
      surge_active: flight.surge_multiplier > 1,
      surge_reset_time: flight.surge_start_time ? 
        new Date(flight.surge_start_time.getTime() + (10 * 60 * 1000)) : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;