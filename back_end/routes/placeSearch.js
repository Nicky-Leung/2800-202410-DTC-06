const sdk = require('@api/fsq-developers');
const express = require('express');
const router = express.Router();

router.post('/placeSearch', async (req, res) => {

    query = req.body.sport;
  
    radius = req.body.radius;
    lat = req.body.lat;
    lng = req.body.lng;
    
    sdk.auth(`${process.env.Foursquare_API_Key}`)
    sdk.placeSearch({query: `${query} Court`, ll: `${lat},${lng}`,radius: `${radius}`})
    .then(({ data }) => {
        console.log(data);
        res.json(data);
    })
    .catch(err => res.status(500).json({ error: err.message }));

});

module.exports = router;
