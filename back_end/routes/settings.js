const express = require('express');
const router = express.Router();
const usersModel = require('../models/userModel');


router.get('/settings', isUserAuthenticated, (req, res) => {
  const currentUser = req.currentUser;
  res.render('settings.ejs', { currentUser: currentUser })
});

router.post('/deleteAccount', isUserAuthenticated, async (req, res) => {
  const currentUser = req.currentUser;
  console.log('user', currentUser)
  try {
    // Delete user from database by ID
    await usersModel.findByIdAndDelete(currentUser._id);
    res.status(200).send('User account deleted successfully');
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).send('Error deleting user account');
  }
});

module.exports = router;