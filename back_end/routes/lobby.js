const express = require('express');
const router = express.Router();
const matchModel = require('../models/matchModel');
const userModel = require('../models/userModel');

router.get('/lobby', async (req, res) => {
    let matchID;
    if (req.session.activematch) {
        matchID = await req.session.activematch;
        (console.log("session"));
    } else {
        matchID = await req.query.matchID;
        console.log("query");
    }
    try {
        delete req.session.activematch;
        const currentUser = await userModel.findOne({ name: req.session.currentUser.name });
        console.log(currentUser);
        const currentMatch = await matchModel.findOne({ _id: matchID });
        console.log(currentMatch);
        homeTeamElo = 0;
        awayTeamElo = 0;
        for(let i = 0; i < currentMatch.homePlayers.length; i++){
            homeTeamElo += currentMatch.homePlayers[i].elo;
        }
        for(let i = 0; i < currentMatch.awayPlayers.length; i++){
            awayTeamElo += currentMatch.awayPlayers[i].elo;
        }
        homeTeamElo = homeTeamElo / currentMatch.homePlayers.length;
        awayTeamElo = awayTeamElo / currentMatch.awayPlayers.length;
        if (currentUser && currentMatch) {
            totalPlayers = parseInt(currentMatch.matchType.charAt(0));
            if ((currentMatch.homePlayers.length + currentMatch.awayPlayers.length) == totalPlayers) {
                res.render('lobby.ejs', {
                    location: currentMatch.location.name,
                    address: currentMatch.location.address,
                    homePlayers: currentMatch.homePlayers, awayPlayers: currentMatch.awayPlayers,
                    homeTeamElo: homeTeamElo, awayTeamElo: awayTeamElo,
                    matchType: currentMatch.matchType, sport: currentMatch.sport
                });
            }
            const isUserInMatch = currentMatch.homePlayers.some(player => player._id.toString() === currentUser._id.toString()) ||
                currentMatch.awayPlayers.some(player => player._id.toString() === currentUser._id.toString())

            if (!isUserInMatch && currentMatch.awayPlayers.length >= currentMatch.homePlayers.length) {
                currentMatch.homePlayers.push(currentUser);
            } else if (!isUserInMatch) {
                currentMatch.awayPlayers.push(currentUser);
            }
        }
        currentMatch.save();
        console.log(currentMatch);
        res.render('lobby.ejs', {
            location: currentMatch.location.name,
            address: currentMatch.location.address,
            homePlayers: currentMatch.homePlayers, awayPlayers: currentMatch.awayPlayers,
            homeTeamElo: homeTeamElo, awayTeamElo: awayTeamElo,

            matchType: currentMatch.matchType, sport: currentMatch.sport,
            matchID: currentMatch._id
        });
    }
    catch (error) {
        console.error('Error during match creation:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;