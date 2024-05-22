const express = require('express');
const router = express.Router();
const matchModel = require('../models/matchModel');


// reset password with email if user has forgotten password but remembers their email
router.get('/matchSessions', async (req, res) => { 

    try {
        const sessions = await matchModel.find();
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;