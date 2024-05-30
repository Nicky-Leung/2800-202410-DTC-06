const express = require('express');
const router = express.Router();
const matchModel = require('../models/matchModel'); 
router.get('/creatematch', (req, res) => {
    res.render('creatematch');
});

/**
 * Create match route that takes the inputed form and creates a new match in the database
 * @body {String} sport - The sport of the match
 * @body {Date} date - The date of the match
 * @body {String} matchType - The type of the match
 * @body {String} location - The location of the match in the form of a array with coordinates as the first two index,
 * the name as the third index and the address as the fourth index
 * @returns [Postcondition] - Writes the match to the database
 * @returns [Postcondition] - Redirects to the lobby page
 * 
 */
router.post('/creatematch', async (req, res) => {

  const { sport, date, matchType } = req.body;
  console.log(req.body.location);
  const time = req.body.time;
  const coordinates = JSON.parse(req.body.location).slice(0, 2);
  const locationName = JSON.parse(req.body.location)[2];
  const address = JSON.parse(req.body.location)[3];
  const fullDate = new Date(`${date}T${time}:00.000Z`);

    const newMatch = new matchModel({
        sport,
        location: {
            type: 'Point',
            coordinates,
            address: address,
            name: locationName

        },
        time: fullDate,
        matchType,
        score: {
          home: 0,
          away: 0,
      },
      homePlayers: [],
      awayPlayers: [],
      timeLeft: 60,

    });
  try {
    await newMatch.save();
    req.session.activematch = newMatch._id;
    console.log(req.session.activematch)
    res.redirect('/lobby');
  } catch (error) {
    console.error('Error during match creation:', error);
    res.status(500).send('Internal Server Error');
  }

});

module.exports = router;