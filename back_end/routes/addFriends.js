const express = require('express');
const router = express.Router();
const usersModel = require('../models/userModel');


/**
 * GET /addFriends
 * Route to display the current user's friends.
 * 
 * @route GET /addFriends
 * @middleware isUserAuthenticated - Middleware to check if the user is authenticated
 * @returns {void} - Renders the addFriends.ejs view with the current user's friends
 * @throws {500} - Internal Server Error if there is an issue fetching the users
 */
router.get('/addFriends', isUserAuthenticated, async (req, res) => {
  try {
    // Find the current user
    const currentUser = await usersModel.findById(req.currentUser._id);
    // Find the current user's friends
    const friendIds = currentUser.friends;

    // Fetch complete user objects corresponding to friend IDs
    const friends = await usersModel.find({ _id: { $in: friendIds } });

    console.log('current user:', currentUser);
    console.log('friends:', friends);

    // Render page with current user's friends
    res.render('addFriends.ejs', { users: friends, currentUser: currentUser });
  } catch (err) {
    console.log('error fetching users', err);
    res.status(500).send('Error fetching friends');
  }
});




// Add a user to friends
router.post('/addFriends/befriend', isUserAuthenticated, async (req, res) => {
  console.log('user:', req.currentUser)
  console.log('friendID:', req.body.friendId)

  try {
    // Try to find current usser
    const currentUser = req.currentUser;
    // Throw error if current user not found
    if (!currentUser || !currentUser._id) {
      throw new Error('Current user is not available or does not have an ID.');
    }
    // Try to find ID of current user's friend
    const friendId = req.body.friendId;
    // Throw error if ID of current user's friend not found
    if (!friendId) {
      throw new Error('Friend ID is not provided in the request body.');
    }
    // Add current user's ID to the friend's array of friends, and vice versa
    await usersModel.findByIdAndUpdate(currentUser._id, { $addToSet: { friends: friendId } });
    await usersModel.findByIdAndUpdate(friendId, { $addToSet: { friends: currentUser._id } });
    res.redirect(`/otherprofile/${friendId}`);


  } catch (err) {
    console.error('Error befriending user:', err);
    res.status(500).send('Error befriending user');
  }
});

// Remove a user from friends
router.post('/addFriends/unfriend', isUserAuthenticated, async (req, res) => {
  try {
    // Try to find current usser
    const currentUser = req.currentUser;
    // Try to find ID of current user's friend
    const friendId = req.body.friendId;

    // Throw errors if current user or friend cannot be found
    if (!currentUser || !currentUser._id) {
      throw new Error('Current user is not available or does not have an ID.');
    }

    if (!friendId) {
      throw new Error('Friend ID is not provided in the request body.');
    }
    // Remove current user's ID from the friend's array of friends, and vice versa
    await usersModel.findByIdAndUpdate(currentUser._id, { $pull: { friends: friendId } });
    await usersModel.findByIdAndUpdate(friendId, { $pull: { friends: currentUser._id } });

    // Redirect back to  previous page
    res.redirect('back');

  } catch (err) {
    console.error('Error unfriending user:', err);
    res.status(500).send('Error unfriending user');
  }
});

module.exports = router;