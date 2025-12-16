const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

/* =====================
   REGISTER
   ===================== */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔒 Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // 🔁 Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // ✅ CREATE USER
    const user = await User.create({
      name,   // 🔥 IMPORTANT FIX
      email,
      password
    });

    // 🔐 CREATE TOKEN
    const token = jwt.sign(
      { id: user._id },
      'SECRET_KEY',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        wallet_balance: user.wallet_balance
      }
    });
  } catch (err) {
    console.error('REGISTER ERROR:', err); // 🔥 DO NOT REMOVE
    res.status(500).json({ error: err.message });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // 1️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // 2️⃣ Compare password (VERY IMPORTANT)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // 3️⃣ Create token
    const token = jwt.sign(
      { id: user._id },
      'SECRET_KEY',
      { expiresIn: '7d' }
    );

    // 4️⃣ Respond
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,               
        email: user.email,
        wallet_balance: user.wallet_balance
      }
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
