const express = require('express');
const router = express.Router();
const matchModel = require('../models/matchModel');

router.get('/match', async (req, res) => {
    try {
        let matchID;
        if (req.session.activematch) {
            matchID = await req.session.activematch;
            console.log("session");
        } else {
            matchID = await req.query.matchID;
            console.log("query");
        }

        const currentMatch = await matchModel.findOne({ _id: matchID });

        if (!currentMatch) {
            return res.status(404).json({ message: "Match not found" });
        }

        res.render('match.ejs', {
            location: currentMatch.location.name,
            homePlayers: currentMatch.homePlayers,
            awayPlayers: currentMatch.awayPlayers,
            matchType: currentMatch.matchType,
            sport: currentMatch.sport
        });
    } catch (error) {
        console.error('Error fetching match data:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
