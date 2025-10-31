

const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();
const jwtKey = require('../config')
const User = require('../models/socialUser');


const client = new OAuth2Client('200477791837-u65ksdvpts7drj16erfjfih1rnf1b57c.apps.googleusercontent.com');

router.post('/google', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Token is required' });

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '200477791837-u65ksdvpts7drj16erfjfih1rnf1b57c.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, name, picture });
      await user.save();
    }

    const appToken = jwt.sign({ email, name, picture }, jwtKey.jwtSecret, { expiresIn: '1h' });

    res.status(200).json({ token: appToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

module.exports = router;
