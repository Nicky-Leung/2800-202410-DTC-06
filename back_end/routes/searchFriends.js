const express = require('express');
const router = express.Router();
const usersModel = require('../models/userModel');

/**
 * GET /searchFriends
 * Route to search for friends based on a query string
 * @route GET /searchFriends
 * @middleware isUserAuthenticated - Middleware to check if the user is authenticated
 * @param {string} req.query.query - The query string to search for friends
 * @returns {void} - Renders the searchFriends.ejs view with the search results
 * @throws {500} - Internal Server Error if there is an issue during the search
 */
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