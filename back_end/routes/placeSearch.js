const sdk = require('@api/fsq-developers');
const express = require('express');
const router = express.Router();

router.get('/placeSearch', (req, res) => {
    
    sdk.auth(`${process.env.Foursquare_API_Key}`)
    sdk.placeSearch({query: `${req.query.query} Court`, ll: `${req.query.lat},${req.query.lng}`})
    .then(({ data }) => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));

});

module.exports = router;
