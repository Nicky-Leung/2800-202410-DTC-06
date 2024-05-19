const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');


// get map data
router.get('/map-data', async (req, res) => {
  try {
    const response = await fetch(`https://api.maptiler.com/maps/75069241-05c3-417f-914f-a7ef07072f3d/style.json?key=${process.env.MapKey}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
module.exports = router;