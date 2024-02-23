const express = require('express');
const router = express.Router();

router.get('/warehouse', (req, res) => {
    res.send('List of warehouse');
})


module.exports = router;