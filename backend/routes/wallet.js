const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get wallet balance
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      balance: user.wallet_balance,
      history: user.wallet_history.slice(-10) // Last 10 transactions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add funds to wallet
router.post('/:userId/add', async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    user.wallet_balance += amount;
    user.wallet_history.push({
      amount: amount,
      type: 'credit',
      description: 'Wallet top-up',
      date: new Date()
    });

    await user.save();

    res.json({
      success: true,
      new_balance: user.wallet_balance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;