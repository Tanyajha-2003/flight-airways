const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get or create user
router.post('/init', async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        username: name,
        email,
        password: 'temp1234' // hashed by pre-save hook
      });
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.username,
      email: user.email,
      wallet_balance: user.wallet_balance
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
