const express = require('express');
const router = express.Router();
const app = express();
const usersModel = require('../models/userModel');

router.get('/leaderboard', async (req, res) => {
    try {
        const topusers = await usersModel.find({}, {name: 1, rank: 1, elo: 1, profilePicture: 1}).sort({elo: -1}).limit(3);
        console.log(topusers);
        res.render('leaderboard.ejs',{topusers: topusers});
      } catch (err) {
        console.log('error fetching users');
      }
    });

module.exports = router;