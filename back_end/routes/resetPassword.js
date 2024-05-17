const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const usersModel = require('../models/userModel');

// reset user while logged in
router.get('/resetPassword', isUserAuthenticated, (req, res) => {
  res.render('resetPassword.ejs');
});

// Encrypt password to be stored in the database
function hashPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// find user via email and then reset their password
router.post('/resetPassword', isUserAuthenticated, async (req, res) => {
  const newPassword = req.body.newPassword;
  const email = req.session.email;

  try {
    const user = await usersModel.findOne({ email: email });
    const hashedPassword = hashPassword(newPassword);
    await usersModel.updateOne({ email: email }, { password: hashedPassword });
    res.redirect('/profile');
  } catch (error) {
    console.error('Error during password reset:', error);
  }
});

module.exports = router;