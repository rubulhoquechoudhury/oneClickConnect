import express from 'express';
import User from '../models/User.js';
import QRCode from 'qrcode';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/my', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.userId) return res.status(400).json({ error: 'User ID not set' });
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const profileUrl = `${baseUrl}/user/${user.userId}`;
    const qrDataUrl = await QRCode.toDataURL(profileUrl, {
      width: 400,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    });
    res.json({ qrCodeUrl: qrDataUrl, profileUrl, userId: user.userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
