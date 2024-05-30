const express = require('express');
const router = express.Router();
const app = express();
const usersModel = require('../models/userModel');

router.get('/localleaderboard', async (req, res) => {
    try {
        const user = await usersModel.findOne({_id: req.session.currentUser._id}, {city: 1}); 
        //MongoDB query to find the user's city from current session
        const topusers = await usersModel.find({city: user.city}, {name: 1, rank: 1, elo: 1, profilePicture: 1}).sort({elo: -1}).limit(3);
        // MongoDB query to find the top 3 users in the user's city
        const allusers = await usersModel.find({city: user.city}, {name: 1, rank: 1, elo: 1, profilePicture: 1, city: 'Vancouver'}).sort({elo: -1});
        // MongoDB query to find all users in the user's city to fill out leaderboard
        currentuser = req.session.currentUser._id;
        res.render('leaderboard_local.ejs',{topusers: topusers, allusers: allusers, currentuser: currentuser});
        // Render the local leaderboard page
      } catch (err) {
        console.log('error fetching users');
      }
    });

    router.get('/regionalleaderboard', async (req, res) => {
      try {
          const user = await usersModel.findOne({_id: req.session.currentUser._id}, {country: 1});
          //MongoDB query to find the user's country from current session
          const topusers = await usersModel.find({country: user.country}, {name: 1, rank: 1, elo: 1, profilePicture: 1}).sort({elo: -1}).limit(3);
          // MongoDB query to find the top 3 users in the user's country
          const allusers = await usersModel.find({country: user.country}, {name: 1, rank: 1, elo: 1, profilePicture: 1}).sort({elo: -1});
          currentuser = req.session.currentUser._id;
          // MongoDB query to find all users in the user's country to fill out leaderboard
          res.render('leaderboard_regional.ejs',{topusers: topusers, allusers: allusers, currentuser: currentuser});
          // Render the regional leaderboard page
        } catch (err) {
          console.log('error fetching users');
        }
      });
      
      //
      router.get('/globalleaderboard', async (req, res) => {
        try {
          //MongoDB query to find the top 3 users globally
            const topusers = await usersModel.find({}, {name: 1, rank: 1, elo: 1, profilePicture: 1}).sort({elo: -1}).limit(3);
            // MongoDB query to find all users globally to fill out leaderboard
            const allusers = await usersModel.find({}, {name: 1, rank: 1, elo: 1, profilePicture: 1}).sort({elo: -1});
            currentuser = req.session.currentUser._id;
            // Render the global leaderboard page
            res.render('leaderboard_global.ejs',{topusers: topusers, allusers: allusers, currentuser: currentuser});
            // Render the global leaderboard page
          } catch (err) {
            console.log('error fetching users');
          }
        });

module.exports = router;