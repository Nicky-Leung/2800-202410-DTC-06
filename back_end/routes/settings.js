const express = require('express');
const router = express.Router();
const usersModel = require('../models/userModel');

/**
 * GET /settings
 * Route to render the settings page for the authenticated user
 * @route GET /settings
 * @middleware isUserAuthenticated - Middleware to check if the user is authenticated
 * @returns {void} - Renders the settings.ejs view with the current user's data
 */
router.get('/settings', isUserAuthenticated, (req, res) => {
  // Get the current user
  const currentUser = req.currentUser;
  // Render settings/ejs view for current user
  res.render('settings.ejs', { currentUser: currentUser })
});

/**
 * POST /deleteAccount
 * Route to delete the user's account
 * @route POST /deleteAccount
 * @middleware isUserAuthenticated - Middleware to check if the user is logged in
 * @returns {void} - Sends a success message if the account is deleted, otherwise sends an error message
 * @throws {500} - Internal Server Error if there is an issue during account deletion
 */
router.post('/deleteAccount', isUserAuthenticated, async (req, res) => {
  // Get the current user
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