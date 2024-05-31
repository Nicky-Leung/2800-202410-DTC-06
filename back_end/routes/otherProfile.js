const usermodel = require('../models/userModel');
const express = require('express');
const router = express.Router();

router.use('/public', express.static('public'));


/**
 * @description This route renders the other user's profile page with the other user's details.
 * @param {string} userid - The id of the user whose profile is to be rendered.
 * @returns {object} - The other user's details.
 * @throws {404} - If the user is not found.
 * @throws {500} - If there is an internal server error.
 */
router.get('/otherProfile/:userid', isUserAuthenticated, async (req, res) => {
    try {
        // find the user with the user id via the user model
        const user = await usermodel.findOne({ _id: req.params.userid });
        // log to check 
        console.log('OP : user: ', user)
        if (!user) {
            // if the user is not found, return a 404 status and a message
            return res.status(404).send('User not found');
        }

        // find the current user 
        const current = req.currentUser;
        console.log('OP : current:  ', current)
        console.log('current id: ', current._id)
        // find the other user by the specified user id
        otherUser = await usermodel.findOne({ _id: current._id });
        console.log('otherUser: ', otherUser)

        // declare is friend as false by default
        let isFriend = false;
        console.log('user id:', req.params.userid)
        // condition to check if the current user is friends with the other user (user that is being viewed)
        if (otherUser && otherUser.friends.map(friend => friend.toString()).includes(req.params.userid)) {
            // if friend, set is friend to true
            isFriend = true;
            console.log('you are friends')
        } else {
            // if not, is friend remains false
            console.log('you are NOT friends')
        }
        // if current id is the same as the user id, render the profile page since the user is viewing their own profile
        if (current._id == req.params.userid) {
            res.render('profile.ejs', { name: user.name, email: user.email, type: user.type, bio: user.bio, profilePicture: user.profilePicture, isFriend, rank: user.rank, sportsmanship: user.sportsmanship, elo: user.elo, streak: user.streak, streakCount: user.streakCount, matchHistory: user.matchHistory, userid: user._id });
        }

        // if the current user is not the same as the user id, render the other user's profile page since the user is viewing another user's profile
        res.render('otherProfile.ejs', { name: user.name, email: user.email, type: user.type, bio: user.bio, profilePicture: user.profilePicture, isFriend, rank: user.rank, sportsmanship: user.sportsmanship, elo: user.elo, streak: user.streak, streakCount: user.streakCount, matchHistory: user.matchHistory, userid: user._id });
    } catch (err) {
        // catch any errors and log them
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
