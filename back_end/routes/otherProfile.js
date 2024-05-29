const usermodel = require('../models/userModel');
const express = require('express');
const router = express.Router();

router.use('/public', express.static('public'));



router.get('/otherProfile/:userid', async (req, res) => {
    try {
        const user = await usermodel.findOne({ _id: req.params.userid });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const current = req.currentUser;
        let isFriend = false;
        if (current && current.friends.map(friend => friend.toString()).includes(req.params.userid)) {
            isFriend = true;
        }

        res.render('otherProfile.ejs', { name: user.name, email: user.email, type: user.type, bio: user.bio, profilePicture: user.profilePicture, isFriend, rank: user.rank, sportsmanship: user.sportsmanship, elo: user.elo, streak: user.streak, streakCount: user.streakCount, matchHistory: user.matchHistory });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
