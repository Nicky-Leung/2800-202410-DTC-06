const express = require('express');
const router = express.Router();
const usermodel = require('../models/userModel');

// Middleware to check if user is logged in
const isUserAuthenticated = (req, res, next) => {
    if (req.session.authenticated) {
        req.currentUser = req.session.currentUser;
        next();
    } else {
        res.status(401).render('notLoggedIn.ejs', { message: 'Please login first' });
    }
};


router.get('/profile', isUserAuthenticated, async (req, res) => {
    try {
        // Find user by email
        const user = await usermodel.findOne({ email: req.session.email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        // Render the user's profile
        res.render('profile.ejs', {
            name: req.session.name,
            email: req.session.email,
            type: req.session.type,
            bio: req.session.bio,
            profilePicture: user.profilePicture,
            rank: user.rank,
            sportsmanship: user.sportsmanship,
            elo: user.elo,
            streak: user.streak,
            streakCount: user.streakCount,
            matchHistory: user.matchHistory

        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
}
);
router.get('/getUserpicture', async (req, res) => {
    const user = await usermodel.findOne({ email: req.session.email });
    const profilePicture = user.profilePicture;
    const rank = user.rank;
    res.send({ profilePicture, rank })
});
module.exports = router;
