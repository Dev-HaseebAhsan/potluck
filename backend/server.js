require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const verifyToken = require('./middleware/auth');
const userRoutes = require('./api-routes/user-route');

const app = express();
const apiRouter = require('./api');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// API routes
app.use('/api', apiRouter);
app.use('/api/users', userRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Potluck API' });
});

// Protected route
app.get('api/test-auth', verifyToken, (req, res) => {
  res.json({
    message: 'Authentication successful.',
    user: req.user
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});