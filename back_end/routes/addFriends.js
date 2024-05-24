const express = require('express');
const router = express.Router();
const usersModel = require('../models/userModel');

router.get('/addFriends', isUserAuthenticated, async (req, res) => {
  try {
    const users = await usersModel.find({});
    const currentUser = req.currentUser;
    console.log('current user', currentUser)
    res.render('addFriends.ejs', { users: users, currentUser: currentUser });
  } catch (err) {
    console.log('error fetching users');
  }
});

router.post('/addFriends/befriend', isUserAuthenticated, async (req, res) => {
  console.log('user:', req.currentUser)
  console.log('friendID:', req.body.friendId)

  try {
    const currentUser = req.currentUser;
    if (!currentUser || !currentUser._id) {
      throw new Error('Current user is not available or does not have an ID.');
    }

    const friendId = req.body.friendId;
    if (!friendId) {
      throw new Error('Friend ID is not provided in the request body.');
    }

    await usersModel.findByIdAndUpdate(currentUser._id, { $addToSet: { friends: friendId } });
    await usersModel.findByIdAndUpdate(friendId, { $addToSet: { friends: currentUser._id } });

    res.redirect('/addFriends');
  } catch (err) {
    console.error('Error befriending user:', err);
    res.status(500).send('Error befriending user');
  }
});


module.exports = router;