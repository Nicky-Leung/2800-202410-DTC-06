const usermodel = require('../models/userModel');
const express = require('express');
const router = express.Router();

const isUserAuthenticated = (req, res, next) => {
    if (req.session.authenticated) {
        req.currentUser = req.session.currentUser;
        next();
    } else {
        res.status(401).render('notLoggedIn.ejs', { message: 'Please login first' });
    }
};

router.get('/otherProfile/:userid', isUserAuthenticated, async (req, res) => {
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

        res.render('otherProfile.ejs', { name: user.name, email: user.email, type: user.type, bio: user.bio, profilePicture: user.profilePicture, isFriend });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
