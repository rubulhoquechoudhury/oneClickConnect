import express from 'express';
import User from '../models/User.js';
import QRCode from 'qrcode';

const router = express.Router();

// Public profile by userId (for QR scanning)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.id })
      .select('-password -contacts');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
