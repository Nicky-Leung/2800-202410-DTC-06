//routes for match summary page 
// dependencies
const express = require('express');
const router = express.Router();
const matchModel = require('../models/matchModel');
const usersModel = require('../models/userModel');
const prevMatchModel = require('../models/previousMatchModel');

/*
* get request for match summary page at /matchend
* @param {Object} req - request object
* @param {Object} res - response object
* @returns {Object} - renders match summary page with match details.
*/
router.get('/matchend', async (req, res) => {
    try {
        // get match id from session or query
        let matchID;
        // if match id is in session, use that
        if (req.session.activematch) {
            // set match id to session match id
            matchID = req.session.activematch;
            // if match id is in query, use that
        } else if (req.query.matchID) {
            // set match id to query match id
            matchID = req.query.matchID;
            // set session match id to query match id
            req.session.activematch = matchID;
        } else {
            // return error if no match id
            return res.status(400).json({ message: "Match ID not provided" });
        }
        // get current player via session
        player = await usersModel.findById(req.session.currentUser._id);
        // get current match via match id
        const currentMatch = await matchModel.findOne({ _id: matchID });
        // if no match found, return error
        if (!currentMatch) {
            return res.status(404).json({ message: "Match not found" });
        }

        // get current user from session
        const currentUser = req.session.currentUser;

        // get current team
        let currentTeam;
        // these conditions are to check if the current user is in the home or away team and if not, return an error
        if (currentMatch.homePlayers.some(player => player._id.equals(currentUser._id))) {
            currentTeam = currentMatch.homePlayers;
        } else if (currentMatch.awayPlayers.some(player => player._id.equals(currentUser._id))) {
            currentTeam = currentMatch.awayPlayers;
        } else {
            return res.status(400).json({ message: "Current user not found in match teams" });
        }

        // get winning team via score
        let winningTeam;
        // these conditions are to check if the home team or away team won or if it was a tie
        if (currentMatch.score.home > currentMatch.score.away) {
            winningTeam = currentMatch.homePlayers;
        } else if (currentMatch.score.home < currentMatch.score.away) {
            winningTeam = currentMatch.awayPlayers;
        } else {
            winningTeam = null;
        }// for victory sstatus

        // declare current team won as true if the current team user is in is the winning team
        const currentTeamWon = winningTeam && winningTeam.some(player => player._id.equals(currentUser._id));
        // declare tie as true if the winning team is null
        const tie = winningTeam === null;

        // render match summary page with match details
        res.render('matchover.ejs', {
            // location of the match
            location: currentMatch.location.name,
            // home team players
            homePlayers: currentMatch.homePlayers,
            // away team players
            awayPlayers: currentMatch.awayPlayers,
            // match type (3v3, 4v4 etc.)
            matchType: currentMatch.matchType,
            // sport of the match
            sport: currentMatch.sport,
            // host of the user
            hostname: currentMatch.homePlayers[0].name,
            // rank of the host
            hostrank: currentMatch.homePlayers[0].rank,
            // match id
            matchID: currentMatch._id,
            // winning team
            currentTeamWon: currentTeamWon,
            // home team score
            homescore: currentMatch.score.home,
            // away team score
            awayscore: currentMatch.score.away,
            // current user
            currentUser: currentUser,
            // current user id, if no current user, set to null
            currentuserid: req.session.currentUser ? req.session.currentUser._id : null,
            // tie status
            tie: tie,
            // user rank/elo
            userElo: currentUser.elo,
        });
    } catch (error) {
        // catch error and log it
        console.error('Error fetching match data:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

/** 
 * @description: post request to update elo of players after match; increases or decreases elo based on win or loss.
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {Object} - updates elo of players and redirects to match summary page
 * @throws {Object} - error message if elo update fails
 * 
 */
router.post('/updateElo', async (req, res) => {
    // try to update elo
    try {
        // get match id from session or query
        let matchID;
        // if match id is in session, use that
        if (req.session.activematch) {
            // set match id to session match id
            matchID = req.session.activematch;
            // if match id is in query, use that
        } else if (req.query.matchID) {
            // set match id to query match id
            matchID = req.query.matchID;
            // set session match id to query match id
            req.session.activematch = matchID;
        } else {
            // return error if no match id
            return res.status(400).json({ message: "No match ID!" });
        }
        // get current match via match id
        const currentMatch = await matchModel.findOne({ _id: matchID });
        // if no match found, return error
        if (!currentMatch) {
            return res.status(404).json({ message: "Match not found" });
        }
        // get current user from session
        const currentUser = req.session.currentUser;
        let currentTeam;
        // these conditions are to check if the current user is in the home or away team and if not, return an error
        if (currentMatch.homePlayers.some(player => player._id.equals(currentUser._id))) {
            currentTeam = currentMatch.homePlayers;
        } else if (currentMatch.awayPlayers.some(player => player._id.equals(currentUser._id))) {
            currentTeam = currentMatch.awayPlayers;
        } else {
            return res.status(400).json({ message: "Current user not found in match teams" });
        }
        // to check which team is the current team and which is the other team. If current team is home team, other team is away team and vice versa
        let otherTeam = currentTeam === currentMatch.homePlayers ? currentMatch.awayPlayers : currentMatch.homePlayers;

        // get winning team via score
        let winningTeam;
        if (currentMatch.score.home > currentMatch.score.away) {// home wins
            winningTeam = currentMatch.homePlayers;
        } else if (currentMatch.score.home < currentMatch.score.away) {// away wins
            winningTeam = currentMatch.awayPlayers;
        } else {
            winningTeam = null; // tie
        }
        // elo change based on win or loss. +20 for win, -20 for loss
        const elochange = winningTeam && winningTeam.some(player => player._id.equals(currentUser._id)) ? 20 : -20 // elo change


        /**
         * @description: update elo of players in the current team and other team
         * @param {Object} player - player object
         * @param {Object} user - user object
         * @param {Number} elochange - elo change
         * @returns {Object} - updates elo of players
         * @throws {Object} - error message if elo update fails
         * @author github copilot
         * The team mappping and Promise is done by github copilot. The elo change is done by dev. 
         */
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
        // return success message, redirect to match summary page
        res.status(200).json({ message: "Elo updated" });
        res.redirect('/matchend');
    } catch (error) {
        console.error('Error updating elo:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }

})

/** 
 * @description: post request to update sportsmanship rating of players after match; increases or decreases sportsmanship based on rating.
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @body {String} userId - user id of player
 * @body {String} rating - rating of player
 * @returns {Object} - updates sportsmanship of players and sends success message
 * @throws {Object} - error message if sportsmanship update fails
 * 
 */
router.post('/updateSportsmanship', async (req, res) => {
    try {
        // get user id and rating from request body
        const { userId, rating } = req.body;
        // find user by id
        const user = await usersModel.findById(userId);

        // set points to 0
        let points = 0;
        // set points based on rating
        if (rating === 'terrible') {
            points = -20; // -20 for bad sportsmanship
        } else if (rating === 'happy') {
            points = 20;  // +20 for good sportsmanship
        } else {
            points = 0;   // neutral stays the same
        }

        // declare new sportsmanship which is the current sportsmanship + points
        const newSportsmanship = user.sportsmanship + points;

        // add a cap to sportsmanship, minimum 0, maximum 500
        user.sportsmanship = Math.max(Math.min(newSportsmanship, 500), 0);
        // save user
        await user.save();
        // return success message
        res.status(200).json({ message: `Sportsmanship updated for ${user.name}`, sportsmanship: user.sportsmanship });
    } catch (error) {
        console.error('Error updating sportsmanship:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

/** 
 * @description: post request to end match; moves match to previous matches collection and updates match history of players.
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {String} matchId - match id
 * @returns {Object} - ends match and redirects to index page
 * @throws {Object} - error message if match end fails
 */
router.post('/matchEnd/:matchId', async (req, res) => {
    try {
        // get match id from request params
        const matchId = req.params.matchId;
        // find current match by id via match model
        const currentMatch = await matchModel.findById(matchId);
        // if no match found, return error
        if (!currentMatch) {
            return res.status(404).json({ message: "Match not found in current matches" });
        }
        // create new previous match model with current match details
        const previousMatch = new prevMatchModel({
            // sport of the match
            sport: currentMatch.sport,
            // location of the match
            location: currentMatch.location,
            // time of the match
            time: currentMatch.time,
            // date of the match
            date: currentMatch.date,
            // match type (3v3, 4v4 etc.)
            matchType: currentMatch.matchType,
            // rank of the match
            rank: currentMatch.rank,
            // elo of the match
            elo: currentMatch.elo,
            // final score of the match
            score: currentMatch.score,
            // players in the home team
            homePlayers: currentMatch.homePlayers,
            // players in the away team
            awayPlayers: currentMatch.awayPlayers,
            // time left in the match
            timeLeft: currentMatch.timeLeft
        });

        // create match result object containing match details
        matchResult = {
            sport: currentMatch.sport,
            homeScore: currentMatch.score.home,
            awayScore: currentMatch.score.away,
            matchType: currentMatch.matchType,
            location: currentMatch.location,
            time: currentMatch.time,
            date: currentMatch.date,
            elo: currentMatch.elo,
            win: false
        }
        // log result for debugging
        console.log(matchResult)

        await previousMatch.save();
        await matchModel.findByIdAndDelete(matchId); // Corrected typo here
        for (let i = 0; i < currentMatch.homePlayers.length; i++) {
            const user = await usersModel.findById(currentMatch.homePlayers[i]._id);
            console.log(user);
            user.matchHistory.push(matchResult);
            if (currentMatch.score.home > currentMatch.score.away) {
                user.matchHistory[user.matchHistory.length - 1].win = true;

            }
            else {
                user.matchHistory[user.matchHistory.length - 1].win = false;

            }
            await user.save();
        }

        for (let i = 0; i < currentMatch.awayPlayers.length; i++) {
            const user = await usersModel.findById(currentMatch.awayPlayers[i]._id);
            user.matchHistory.push(matchResult);
            if (currentMatch.score.home < currentMatch.score.away) {
                user.matchHistory[user.matchHistory.length - 1].win = true;


            }
            else {
                user.matchHistory[user.matchHistory.length - 1].win = false;

            }
            await user.save();
        }
        console.log('Match ended successfully');
        res.redirect('/index');

    } catch (error) {
        console.error('Error ending match:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});





module.exports = router;

