const express = require('express');
const router = express.Router();
const matchModel = require('../models/matchModel');
const userModel = require('../models/userModel');

router.get('/lobby', async (req, res) => {
    if (req.session.activematch) {
        const matchID = await req.session.activematch;
    } else {const matchID = await req.query.matchID;}
    try {
        const currentUser = await userModel.findOne({name: req.session.currentUser.name});
        console.log(currentUser);
        const currentMatch = await matchModel.findOne({_id: matchID});
        console.log(currentMatch);
        if (currentUser && currentMatch) {
            console.log(currentUser);
            console.log(currentMatch);
            totalPlayers = parseInt(currentMatch.matchType.charAt(0));
            if (teamCount = currentMatch.homePlayers.length + currentMatch.awayPlayers.length == totalPlayers) {
                res.render('match.ejs');
            } else if (currentMatch.homePlayers.length < currentMatch.awayPlayers.length) {
                currentMatch.homePlayers.push(currentUser);
            } else {
                currentMatch.awayPlayers.push(currentUser);
            }}
            console.log (currentMatch);
            res.render('lobby.ejs', {location: currentMatch.location.name, 
                homePlayers: currentMatch.homePlayers, awayPlayers: currentMatch.awayPlayers});
    
    }   
    catch (error) {
        console.error('Error during match creation:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;