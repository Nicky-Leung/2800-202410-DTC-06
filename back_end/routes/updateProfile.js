const express = require('express');
const router = express.Router();
const usersModel = require('../models/userModel');

router.post('/updateProfile', async (req, res) => {
  const { name, bio } = req.body;
  const update = { name, bio };
  try {
    await usersModel.updateOne({ email: req.session.email }, update);
    // Update session data
    req.session.name = name;
    req.session.bio = bio;
    res.redirect('/home?profileUpdated=true');
  } catch (error) {
    console.error('Error during profile update:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;