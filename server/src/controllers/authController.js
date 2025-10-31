const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const { jwtSecret } = require('../config.js');

exports.register = async (req, res) => {
  try {
    const { username, email, contactNumber, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ username, email, contactNumber, password });
    return res.status(201).json({ message: 'User registered', userId: user._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email/username and password required' });
    }
    const user = await User.findOne({ $or: [{ email: email }] });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
    return res.json({ token, user: { id: user._id, username: user.username, email: user.email, contactNumber: user.contactNumber } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.users = async (req, res) => {
  res.send({ message: 'hello Aadi' })

}