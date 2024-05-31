const sdk = require('@api/fsq-developers');
const express = require('express');
const router = express.Router();

/**
 * 
 * @description This route is used to search for a place using the Foursquare API
 * @body {String} sport - The sport that the user is searching for
 * @body {Integer} radius - The radius of the search
 * @body {Float} lat - The latitude of the location that the user is searching from
 * @body {Float} lng - The longitude of the location that the user is searching from
 * @returns {JSON} JSON object containing the data from the Foursquare API based on the search query
 */

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
