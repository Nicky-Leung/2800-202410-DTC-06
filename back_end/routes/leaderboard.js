const express = require('express');
const router = express.Router();
const app = express();
const usersModel = require('../models/userModel');

router.get('/localleaderboard', async (req, res) => {
    try {
        const topusers = await usersModel.find({}, {name: 1, rank: 1, elo: 1, profilePicture: 1}).sort({elo: -1}).limit(3);
        const allusers = await usersModel.find({}, {name: 1, rank: 1, elo: 1, profilePicture: 1}).sort({elo: -1});
        currentuser = req.session.currentUser._id;
        res.render('leaderboard_local.ejs',{topusers: topusers, allusers: allusers, currentuser: currentuser});
      } catch (err) {
        console.log('error fetching users');
      }
    });

    router.get('/regionalleaderboard', async (req, res) => {
      try {
          const topusers = await usersModel.find({}, {name: 1, rank: 1, elo: 1, profilePicture: 1}).sort({elo: -1}).limit(3);
          const allusers = await usersModel.find({}, {name: 1, rank: 1, elo: 1, profilePicture: 1}).sort({elo: -1});
          currentuser = req.session.currentUser._id;
          res.render('leaderboard_regional.ejs',{topusers: topusers, allusers: allusers, currentuser: currentuser});
        } catch (err) {
          console.log('error fetching users');
        }
      });

      router.get('/globalleaderboard', async (req, res) => {
        try {
            const topusers = await usersModel.find({}, {name: 1, rank: 1, elo: 1, profilePicture: 1}).sort({elo: -1}).limit(3);
            const allusers = await usersModel.find({}, {name: 1, rank: 1, elo: 1, profilePicture: 1}).sort({elo: -1});
            currentuser = req.session.currentUser._id;
            res.render('leaderboard_global.ejs',{topusers: topusers, allusers: allusers, currentuser: currentuser});
          } catch (err) {
            console.log('error fetching users');
          }
        });

module.exports = router;