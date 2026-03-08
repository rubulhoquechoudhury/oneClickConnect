import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import userRoutes from './routes/user.js';
import contactsRoutes from './routes/contacts.js';
import qrRoutes from './routes/qr.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// Allow multiple origins so production (Vercel) + dev work
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173,http://localhost:3000,https://net-pulse-wine.vercel.app,https://net-pulse2.vercel.app')
  .split(',')
  .map(s => s.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, origin || allowedOrigins[0]);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/user', userRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/qr', qrRoutes);

app.get('/', (req, res) => {
  res.send(`Server is running on port ${PORT}`);
});


// Ensure MongoDB is connected before handling requests (important for serverless cold starts)
const mongoPromise = process.env.MONGODB_URI
  ? mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log('MongoDB connected');
      return true;
    }).catch(err => {
      console.error('MongoDB error:', err);
      throw err;
    })
  : Promise.reject(new Error('MONGODB_URI not set'));

app.use(async (req, res, next) => {
  try {
    await mongoPromise;
    next();
  } catch (err) {
    res.status(503).json({ error: 'Database unavailable' });
  }
});

// Export for Vercel serverless; only listen when running locally
if (!process.env.VERCEL) {
  mongoPromise.then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }).catch(() => {});
}

export default app;
