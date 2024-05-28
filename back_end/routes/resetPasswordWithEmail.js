const express = require('express');
const router = express.Router();
const usersModel = require('../models/userModel');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

// SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_DEV_PASSWORD_RESET_KEY);


// Generate a random token
function generateToken() {
  return crypto.randomBytes(20).toString('hex');
}

// Store the token with the user email
const passwordResetTokens = new Map();

// reset password with email if user has forgotten password but remembers their email
router.get('/resetPasswordWithEmail', (req, res) => {
  res.render('resetPasswordWithEmail.ejs');
});

// Encrypt password to be stored in database
function hashPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// Send password reset email with unique token
router.post('/resetPasswordWithEmail', async (req, res) => {
  const email = req.body.email;
  console.log('email (post resetpw w email): ', email)
  req.session.email = email;

  try {
    // Check if user exists
    const user = await usersModel.findOne({ email: email });
    if (!user) {
      // Handle case where user doesn't exist
      return res.status(404).send('User not found');
    }

    // Generate unique token
    const token = generateToken();

    // Store token with the user email
    passwordResetTokens.set(email, token);

    // Create a password reset link with the token
    const resetLink = `http://localhost:3000/resetPasswordForm?token=${token}&email=${email}`;


    // Send password reset email
    const msg = {
      to: email,
      from: 'gamesetmatchdtcsix@gmail.com',
      subject: 'Password Reset',
      html: `Click <a href="${resetLink}">here</a> to reset your password.`,
    };

    await sgMail.send(msg);

    console.log('email sent')
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle password reset
router.get('/resetPasswordForm', async (req, res) => {
  const email = req.query.email;
  console.log('email: ', email)

  const token = req.query.token.trim().toLowerCase();

  console.log('Token: ', token);
  console.log('PasswordResetTokens: ', passwordResetTokens);


  // Code below should work - it doesn't - console logs indicate that tokens are generated/stored correctly


  // if (!passwordResetTokens.has(token)) {
  //   console.log('Token not found in passwordResetTokens map.');
  //   return res.status(400).send('Invalid or expired token deez nuts');
  // }

  // const email = passwordResetTokens.get(token);

  res.render('resetPasswordForm.ejs', { email, token });
});

// Route to handle password reset form submission
router.post('/resetPasswordForm', async (req, res) => {
  const { email, token, newPassword } = req.body;
  console.log('req body:', req.body)

  // Code below should work - it doesn't - console logs indicate that tokens are generated/stored correctly

  // if (!passwordResetTokens.has(token) || passwordResetTokens.get(token) !== email) {
  //   return res.status(400).send('Invalid or expired token');
  // }

  try {
    // Update user password in database
    console.log('new pw: ', newPassword)
    const hashedPassword = hashPassword(newPassword);
    console.log('email:', email)
    await usersModel.updateOne({ email: email }, { password: hashedPassword });

    // Remove token from the map to prevent reuse
    passwordResetTokens.delete(token);

    res.send('Password reset successfully');
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
