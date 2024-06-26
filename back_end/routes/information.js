const express = require('express');
const router = express.Router();
const matchModel = require('../models/matchModel');



  
/**
 * 
 * Information route that takes the inputed form and displays the information
 */
router.post('/information', async (req, res) => { 
    
    matchType = req.body.matchType;
    matchTime = req.body.matchTime;
    matchDate = req.body.matchDate;
    matchLocation = req.body.matchLocation;
    matchID = req.body.matchID;

    res.render('components/information', {
        matchType: matchType,
        matchTime: matchTime,
        matchDate: matchDate,
        matchLocation: matchLocation,
        matchID: matchID
    })

  
});

module.exports = router;