const usermodel = require('../models/userModel');
const express = require('express');
const router = express.Router();

router.use('/public', express.static('public'));



router.get('/otherProfile/:userid', async (req, res) => {
    try {
        const user = await usermodel.findOne({ _id: req.params.userid });
        console.log('OP : user: ', user)
        if (!user) {
            return res.status(404).send('User not found');
        }

        const current = req.currentUser;
        console.log('OP : current:  ', current)
        console.log('current id: ', current._id)
        current2 = await usermodel.findOne({ _id: current._id });
        console.log('current user:', current)

        let isFriend = false;
        console.log('user id:', req.params.userid)
        if (current2 && current2.friends.map(friend => friend.toString()).includes(req.params.userid)) {
            isFriend = true;
            console.log('you are friends')
        } else {
            console.log('you are not friends')
        }

        // console.log('user id:', req.params.userid)
        // if (ohio && ohio.friends.map(friend => friend.toString()).includes(req.params.userid)) {
        //     isFriend = true;
        //     console.log('you are friends')
        // } else {

        //     console.log('you are not friends')
        // }



        res.render('otherProfile.ejs', { name: user.name, email: user.email, type: user.type, bio: user.bio, profilePicture: user.profilePicture, isFriend, rank: user.rank, sportsmanship: user.sportsmanship, elo: user.elo, streak: user.streak, streakCount: user.streakCount, matchHistory: user.matchHistory });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
