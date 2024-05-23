const express = require('express');
const router = express.Router();

router.get('/lobby', (req, res) => {
    res.render('lobby.ejs');
});


module.exports = router;