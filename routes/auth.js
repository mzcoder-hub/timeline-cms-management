// backend/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  console.log(req.body)
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const user = await User.create({ name, email, password: hashedPassword });
    res.send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  
  if (!user) return res.status(400).send('Invalid email or password');
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');
  
  const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET || 'JWTSECRET');
  res.send({ token });
});

module.exports = router;
