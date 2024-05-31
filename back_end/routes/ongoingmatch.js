const express = require('express');
const router = express.Router();
const matchModel = require('../models/matchModel');

router.use(express.json());

/** 
 * @description This route renders the match page with the match details.
 * @param {string} matchID - The id of the match to be rendered.
 * @returns {object} - The match details.
 * @throws {404} - If the match is not found.
 * @throws {500} - If there is an internal server error.
 * 
 */
router.get('/match', async (req, res) => {
    // try to get the match id from the session or query
    try {
        // check if the match id is in the session
        let matchID;
        if (req.session.activematch) {
            // if the match id is in the session, set the match id to the session activematch
            matchID = req.session.activematch;
            console.log("session");
        } else {
            // if the match id is not in the session, set the match id to the query
            matchID = req.query.matchID;
            console.log("query");
            req.session.activematch = matchID;
        }

        // find the match with the match id via the match model
        const currentMatch = await matchModel.findOne({ _id: matchID });

        // if the match is not found, return a 404 status and a message
        if (!currentMatch) {
            return res.status(404).json({ message: "Match not found" });
        }

        // set the current match in the session
        req.session.currentMatch = currentMatch;

        // render the match page with the match details
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
        // catch any errors and log them
    } catch (error) {
        console.error('Error fetching match data:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

/**
 * @description This route updates the score of the match in the database.
 * @body {string} matchId - The id of the match to update.
 * @body {number} homeScore - The score of the home team.
 * @body {number} awayScore - The score of the away team.
 * @returns {object} - A message indicating that the scores are updated.
 * @throws {500} - If there is an internal server error.
 */
router.post('/updateScore', async (req, res) => {
    try {
        // get the match id, home score, and away score from the request body
        const { matchId, homeScore, awayScore } = req.body;

        // update the match with the match id with the home score and away score via the match model
        await matchModel.findByIdAndUpdate(matchId, {
            'score.home': homeScore,
            'score.away': awayScore
        });
        // return a message indicating that the scores are updated
        res.status(200).json({ message: 'Scores updated successfully' });
    } catch (error) {
        // catch any errors and log them
        console.error('Error updating scores:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
