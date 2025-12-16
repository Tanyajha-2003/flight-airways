// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const rateLimit = require('express-rate-limit');

// dotenv.config();

// const app = express();

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(limiter);

// // Mongoose Connection for Atlas
// mongoose.connect(process.env.MONGODB_URI , {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
//   socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
// })
// .then(() => console.log('✅ Connected to MongoDB Atlas'))
// .catch(err => {
//   console.error('❌ MongoDB connection error:', err.message);
//   console.log('Trying to connect to local MongoDB as fallback...');
  
//   // Fallback to local MongoDB
//   mongoose.connect('mongodb://localhost:27017/flight-booking', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => console.log('✅ Connected to local MongoDB'))
//   .catch(err => console.error('❌ Local MongoDB connection failed:', err));
// });

// // Routes
// const flightRoutes = require('./routes/flights');
// const bookingRoutes = require('./routes/bookings');
// const walletRoutes = require('./routes/wallet');
// const userRoutes = require('./routes/users');
// const authRoutes = require('./routes/auth');

// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);

// app.use('/api/flights', flightRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/wallet', walletRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

// const PORT = process.env.PORT || 5001;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

// ====================
// Rate Limiting
// ====================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// ====================
// Middleware
// ====================
app.use(cors());
app.use(express.json());

// ====================
// MongoDB Connection
// ====================
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('❌ MongoDB Atlas connection error:', err.message);
    console.log('Attempting to connect to local MongoDB as fallback...');
    mongoose.connect('mongodb://localhost:27017/flight-booking', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then(() => console.log('✅ Connected to local MongoDB'))
      .catch(err => console.error('❌ Local MongoDB connection failed:', err));
  });

// ====================
// Routes
// ====================
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const flightRoutes = require('./routes/flights');
const bookingRoutes = require('./routes/bookings');
const walletRoutes = require('./routes/wallet');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/wallet', walletRoutes);

// ====================
// Serve React frontend (Production)
// ====================
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'frontend/build')));
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
//   });
// }


// ====================
// Error Handling
// ====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ====================
// Start Server
// ====================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
