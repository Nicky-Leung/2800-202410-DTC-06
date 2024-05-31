const express = require('express');
const router = express.Router();
const usersModel = require('../models/userModel');

router.get('/searchFriends', isUserAuthenticated, async (req, res) => {
  // Extract query
  const query = req.query.query;
  // Create empty array of friends
  let friends = [];
  // Execute if a query is provided 
  if (query) {
    try {
      // Search for users whose names match the query
      friends = await usersModel.find({ name: new RegExp(query, 'i') }).exec();
    } catch (error) {
      console.error('Error searching for friends:', error);
    }
  }
  // Render search.friends.ejs view with search results
  res.render('searchFriends.ejs', { friends });
});

module.exports = router;