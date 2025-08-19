const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
const { username, email, password } = req.body;
try {
const exists = await User.findOne({ email });
if (exists) {
return res.status(400).json({ error: 'User already exists' });
}
const hashedPassword = await bcrypt.hash(password, 10);
const user = new User({ username, email, password: hashedPassword });
await user.save();
res.status(201).json({ message: 'User registered', user: { username, email } });
} catch (err) {
console.error('Register error:', err.stack || err);
res.status(500).json({ error: 'Server error', details: err.stack || err.message || err });
}
});

// Login route
router.post('/login', async (req, res) => {
const { email, password } = req.body;
try {
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ error: 'Invalid credentials' });

const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

res.status(200).json({ message: 'Login successful', user: { username: user.username, email: user.email, _id: user._id }, token });
} catch (err) {
console.error('Login error:', err.stack || err);
res.status(500).json({ error: 'Server error', details: err.stack || err.message || err });
}
});

module.exports = router;
