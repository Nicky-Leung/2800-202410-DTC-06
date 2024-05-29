const express = require('express');
const router = express.Router();
const matchModel = require('../models/matchModel');
const usersModel = require('../models/userModel');

router.get('/matchend', async (req, res) => {
    try {
        let matchID;
        if (req.session.activematch) {
            matchID = req.session.activematch;
        } else if (req.query.matchID) {
            matchID = req.query.matchID;
            req.session.activematch = matchID;
        } else {
            return res.status(400).json({ message: "Match ID not provided" });
        }
        player = await usersModel.findById(req.session.currentUser._id);

        const currentMatch = await matchModel.findOne({ _id: matchID });
        if (!currentMatch) {
            return res.status(404).json({ message: "Match not found" });
        }

        const currentUser = req.session.currentUser;

        let currentTeam;
        if (currentMatch.homePlayers.some(player => player._id.equals(currentUser._id))) {
            currentTeam = currentMatch.homePlayers;
        } else if (currentMatch.awayPlayers.some(player => player._id.equals(currentUser._id))) {
            currentTeam = currentMatch.awayPlayers;
        } else {
            return res.status(400).json({ message: "Current user not found in match teams" });
        }

        let winningTeam;
        if (currentMatch.score.home > currentMatch.score.away) {
            winningTeam = currentMatch.homePlayers;
        } else if (currentMatch.score.home < currentMatch.score.away) {
            winningTeam = currentMatch.awayPlayers;
        } else {
            winningTeam = null;
        }// for victory sstatus

        const currentTeamWon = winningTeam && winningTeam.some(player => player._id.equals(currentUser._id));
        const tie = winningTeam === null;


        res.render('matchover.ejs', {
            location: currentMatch.location.name,
            homePlayers: currentMatch.homePlayers,
            awayPlayers: currentMatch.awayPlayers,
            matchType: currentMatch.matchType,
            sport: currentMatch.sport,
            hostname: currentMatch.homePlayers[0].name,
            hostrank: currentMatch.homePlayers[0].rank,
            matchID: currentMatch._id,
            currentTeamWon: currentTeamWon,
            homescore: currentMatch.score.home,
            awayscore: currentMatch.score.away,
            currentUser: currentUser,
            currentuserid: req.session.currentUser ? req.session.currentUser._id : null, // sending current user id to front end for ejs
            tie: tie,
            userElo: currentUser.elo
        });
    } catch (error) {
        console.error('Error fetching match data:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/updateElo', async (req, res) => {
    try {
        let matchID;
        if (req.session.activematch) {
            matchID = req.session.activematch;
        } else if (req.query.matchID) {
            matchID = req.query.matchID;
            req.session.activematch = matchID;
        } else {
            return res.status(400).json({ message: "No match ID!" });
        }

        const currentMatch = await matchModel.findOne({ _id: matchID });
        if (!currentMatch) {
            return res.status(404).json({ message: "Match not found" });
        }
        const currentUser = req.session.currentUser;
        let currentTeam;
        if (currentMatch.homePlayers.some(player => player._id.equals(currentUser._id))) {// if user is in home team
            currentTeam = currentMatch.homePlayers;
        } else if (currentMatch.awayPlayers.some(player => player._id.equals(currentUser._id))) {// if user is in away team
            currentTeam = currentMatch.awayPlayers;
        } else {
            return res.status(400).json({ message: "Current user not found in match teams" });// catch error if user is in no team
        }
        let otherTeam = currentTeam === currentMatch.homePlayers ? currentMatch.awayPlayers : currentMatch.homePlayers;

        let winningTeam;
        if (currentMatch.score.home > currentMatch.score.away) {// home wins
            winningTeam = currentMatch.homePlayers;
        } else if (currentMatch.score.home < currentMatch.score.away) {// away wins
            winningTeam = currentMatch.awayPlayers;
        } else {
            winningTeam = null; // tie
        }
        const elochange = winningTeam && winningTeam.some(player => player._id.equals(currentUser._id)) ? 20 : -20 // elo change



        await Promise.all(currentTeam.map(async (player) => {
            const user = await usersModel.findById(player._id);
            user.elo += elochange;
            await user.save();
        }
        ));
        await Promise.all(otherTeam.map(async (player) => {
            const user = await usersModel.findById(player._id);
            user.elo -= elochange;
            await user.save();
        }
        ));
        res.status(200).json({ message: "Elo updated" });
    } catch (error) {
        console.error('Error updating elo:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }

})

module.exports = router;
