const express = require('express');
const router = express.Router();
const usersModel = require('../models/userModel');

// reset user while logged in
router.get('/resetPassword', isUserAuthenticated, (req, res) => {
  res.render('resetPassword.ejs');
});

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