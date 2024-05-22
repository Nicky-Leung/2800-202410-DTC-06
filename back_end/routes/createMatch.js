const express = require('express');
const router = express.Router();
const matchModel = require('../models/matchModel'); // adjust the path as needed

router.get('/creatematch', (req, res) => {
    res.render('creatematch');
});

router.post('/creatematch', async (req, res) => {


  const { sport, date, matchType } = req.body;
  const time = req.body.time;
  const coordinates = JSON.parse(req.body.location).slice(0, 2);
  const locationName = JSON.parse(req.body.location)[2];
  const fullDate = new Date(`${date}T${time}:00.000Z`);

    const newMatch = new matchModel({
        sport,
        location: {
            type: 'Point',
            coordinates,
            name: locationName

        },
        time: fullDate,
        matchType
    });
  try {
    await newMatch.save();
    res.redirect('/index');
  } catch (error) {
    console.error('Error during match creation:', error);
    res.status(500).send('Internal Server Error');
  }

});


module.exports = router;