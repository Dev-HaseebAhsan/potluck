// Use initialized Firebase Admin app from config/firebase.js
const admin = require('./config/firebase');
const express = require('express');
const router = express.Router();


/**
 * POST /create-user
 * Creates a new user in Firebase Authentication with email, username, and password.
 * Request body parameters:
 *   - email: string (required)
 *   - username: string (required, stored as a custom claim)
 *   - password: string (required)
 * Returns:
 *   - 201: User created successfully (user object)
 *   - 400: Missing fields or error from Firebase
 */
router.post('/create-user', async (req, res) => {
  const { email, username, password } = req.body;
  const missingFields = [];
  if (!email) missingFields.push('Email');
  if (!username) missingFields.push('Username');
  if (!password) missingFields.push('Password');
  if (missingFields.length > 0) {
    return res.status(400).json({ error: `${missingFields.join(', ')} ${missingFields.length === 1 ? 'is' : 'are'} required.` });
  }
  try {
    const user = await admin.auth().createUser({
      email,
      password
    });
    // Set custom claim for username
    await admin.auth().setCustomUserClaims(user.uid, { username });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;