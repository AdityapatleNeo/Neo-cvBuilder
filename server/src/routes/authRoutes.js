const express = require('express');
const { register, login, users } = require('../controllers/authController.js');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', users)
module.exports = router;
