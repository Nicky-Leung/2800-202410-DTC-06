const express = require('express');
const router = express.Router();
const matchModel = require('../models/matchModel');

router.use(express.json());

router.get('/match', async (req, res) => {
    try {
        let matchID;
        if (req.session.activematch) {
            matchID = req.session.activematch;
            console.log("session");
        } else {
            matchID = req.query.matchID;
            console.log("query");
            req.session.activematch = matchID;
        }

        const currentMatch = await matchModel.findOne({ _id: matchID });

        if (!currentMatch) {
            return res.status(404).json({ message: "Match not found" });
        }

        req.session.currentMatch = currentMatch;

        res.render('match.ejs', {
            location: currentMatch.location.name,
            homePlayers: currentMatch.homePlayers,
            awayPlayers: currentMatch.awayPlayers,
            matchType: currentMatch.matchType,
            sport: currentMatch.sport,
            hostname: currentMatch.homePlayers[0].name,
            hostrank: currentMatch.homePlayers[0].rank,
            matchID: currentMatch._id
        });
    } catch (error) {
        console.error('Error fetching match data:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/updateScore', async (req, res) => {
    try {
        const { matchId, homeScore, awayScore } = req.body;

        await matchModel.findByIdAndUpdate(matchId, {
            'score.home': homeScore,
            'score.away': awayScore
        });

        res.status(200).json({ message: 'Scores updated successfully' });
    } catch (error) {
        console.error('Error updating scores:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
