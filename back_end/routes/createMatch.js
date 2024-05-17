const express = require('express');
const router = express.Router();
const matchModel = require('../models/matchModel'); // adjust the path as needed

router.get('/creatematch', (req, res) => {
    res.render('creatematch');
});

router.post('/creatematch', async (req, res) => {

  const { sport, location, length, time, date, players, skill, description } = req.body;
  try {
    const newMatch = new matchModel({ sport, location, length, time, date, players, skill, description });
    await newMatch.save();
    console.log('Match created:', newMatch);
    res.redirect('/index');
  } catch (error) {
    console.error('Error during match creation:', error);
    res.status(500).send('Internal Server Error');
  }

});


module.exports = router;