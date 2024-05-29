const express = require('express');
const router = express.Router();
const usersModel = require('../models/userModel');

router.get('/searchFriends', isUserAuthenticated, async (req, res) => {
  const query = req.query.query;
  let friends = [];
  if (query) {
    try {
      friends = await usersModel.find({ name: new RegExp(query, 'i') }).exec();
    } catch (error) {
      console.error('Error searching for friends:', error);
    }
  }
  res.render('searchFriends.ejs', { friends });
});

module.exports = router;