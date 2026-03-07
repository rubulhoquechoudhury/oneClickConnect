import express from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/add', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID required' });
    const contact = await User.findOne({ userId });
    if (!contact) return res.status(404).json({ error: 'User not found' });
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.contacts.some(c => c.toString() === contact._id.toString())) {
      return res.status(400).json({ error: 'Contact already added' });
    }
    if (contact._id.toString() === user._id.toString()) {
      return res.status(400).json({ error: 'Cannot add yourself' });
    }
    user.contacts.push(contact._id);
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
