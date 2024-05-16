const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');


router.get('/map-data', async (req, res) => {
  try {
    const response = await fetch(`https://api.maptiler.com/maps/dataviz/style.json?key=${process.env.MapKey}`);

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
module.exports = router;