const express = require('express');
const router = express.Router();
const usersModel = require('../models/userModel');
const crypto = require('crypto');

// reset password with email if user has forgotten password but remembers their email
router.get('/resetPasswordWithEmail', (req, res) => {
  res.render('resetPasswordWithEmail.ejs');
}
);

// Encrypt password to be stored in the database
function hashPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// find a user by email and let them reset their password 
// TODO: send an email to the user with a link to reset their password
router.post('/resetPasswordWithEmail', async (req, res) => {
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  try {
    const hashedPassword = hashPassword(newPassword);
    await usersModel.updateOne({ email: email }, { password: hashedPassword });
    res.redirect('/login');
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;