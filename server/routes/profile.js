import express from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.put('/', async (req, res) => {
  try {
    const { name, email, phone, socialLinks, extraLinks, avatar } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (socialLinks) {
      user.socialLinks = { ...user.socialLinks, ...socialLinks };
    }
    if (Array.isArray(extraLinks)) {
      user.extraLinks = extraLinks;
    }
    if (avatar !== undefined) {
      user.avatar = avatar;
    }
    if (email && email !== user.email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) return res.status(400).json({ error: 'Email already in use' });
      user.email = email.toLowerCase();
    }
    await user.save();
    const populated = await User.findById(user._id)
      .select('-password')
      .populate('contacts', 'name email phone socialLinks qrCodeUrl userId');
    res.json({ user: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
