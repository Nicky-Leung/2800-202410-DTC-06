const express = require('express');
const router = express.Router();
const usersModel = require('../models/userModel');


// reset password with email if user has forgotten password but remembers their email
router.get('/resetPasswordWithEmail', (req, res) => {
  res.render('resetPasswordWithEmail.ejs');
}
);



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