// routes/bookings.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const User = require('../models/User');

// =========================
// CREATE BOOKING
// =========================
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, flightId, passengerInfo } = req.body;

    if (!userId || !flightId || !passengerInfo) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const flight = await Flight.findOne({ flight_id: flightId }).session(session);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (flight.available_seats <= 0) {
      return res.status(400).json({ error: 'No seats available' });
    }

    if (user.wallet_balance < flight.current_price) {
      return res.status(400).json({
        error: 'Insufficient wallet balance',
        required: flight.current_price,
        available: user.wallet_balance
      });
    }

    // Deduct wallet
    user.wallet_balance -= flight.current_price;
    user.wallet_history.push({
      amount: flight.current_price,
      type: 'debit',
      description: `Flight booking ${flight.flight_id}`,
      date: new Date()
    });

    // Reduce seat
    flight.available_seats -= 1;

// Create booking
const booking = new Booking({
  user_id: userId,
  flight_id: flightId,
  flight_details: {
    airline: flight.airline,
    departure_city: flight.departure_city,
    arrival_city: flight.arrival_city,
    departure_time: flight.departure_time,
    arrival_time: flight.arrival_time
  },
  passenger_name: passengerInfo.name,
  passenger_email: passengerInfo.email,
  passenger_phone: passengerInfo.phone,
  base_price: flight.base_price,
  final_price: flight.current_price
});

// 🔥 FORCE PNR GENERATION
booking.pnr =
  'PNR' +
  Date.now().toString().slice(-8) +
  Math.random().toString(36).substring(2, 6).toUpperCase();

    await booking.save({ session }); // PNR GENERATED HERE

    // Generate PDF
    const pdfPath = await generateTicketPDF(booking, flight);
    booking.ticket_pdf_url = pdfPath;

    await booking.save({ session });
    await user.save({ session });
    await flight.save({ session });

    await session.commitTransaction();

    res.json({
      success: true,
      booking,
      new_balance: user.wallet_balance
    });

  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
});

// =========================
// USER BOOKINGS
// =========================
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ user_id: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =========================
// DOWNLOAD TICKET
// =========================
router.get('/ticket/:pnr', async (req, res) => {
  try {
    const booking = await Booking.findOne({ pnr: req.params.pnr });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const filePath = path.join(__dirname, '../tickets', `${booking.pnr}.pdf`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // 🔥 FORCE DOWNLOAD IN BROWSER
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${booking.pnr}.pdf"`
    );

    res.sendFile(filePath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// PDF GENERATOR
// =========================
function generateTicketPDF(booking, flight) {
  return new Promise((resolve, reject) => {
    const ticketsDir = path.join(__dirname, '../tickets');
    if (!fs.existsSync(ticketsDir)) {
      fs.mkdirSync(ticketsDir, { recursive: true });
    }

    const filePath = path.join(ticketsDir, `${booking.pnr}.pdf`);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fillColor('#6B46C1')
      .fontSize(26)
      .text('FLIGHT TICKET', { align: 'center' })
      .moveDown();

    doc.fillColor('#000')
      .fontSize(14)
      .text(`PNR: ${booking.pnr}`, { align: 'center' })
      .moveDown(2);

    doc.fontSize(14).text('Passenger Details', { underline: true });
    doc.fontSize(12)
      .text(`Name: ${booking.passenger_name}`)
      .text(`Email: ${booking.passenger_email}`)
      .text(`Phone: ${booking.passenger_phone}`)
      .moveDown();

    doc.fontSize(14).text('Flight Details', { underline: true });
    doc.fontSize(12)
      .text(`Airline: ${flight.airline}`)
      .text(`Flight ID: ${flight.flight_id}`)
      .text(`Route: ${flight.departure_city} → ${flight.arrival_city}`)
      .text(`Departure: ${new Date(flight.departure_time).toLocaleString()}`)
      .text(`Arrival: ${new Date(flight.arrival_time).toLocaleString()}`)
      .moveDown();

    doc.fontSize(14).text('Price', { underline: true });
    doc.fontSize(12)
      .text(`Base Price: ₹${booking.base_price}`)
      .text(`Final Price: ₹${booking.final_price}`)
      .text(`Booked On: ${new Date(booking.booking_date).toLocaleString()}`)
      .moveDown();

    doc.fillColor('#6B46C1')
      .fontSize(10)
      .text('Thank you for booking with us ✈️', { align: 'center' });

    doc.end();

    stream.on('finish', () => resolve(`/tickets/${booking.pnr}.pdf`));
    stream.on('error', reject);
  });
}

module.exports = router;